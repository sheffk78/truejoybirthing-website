#!/usr/bin/env python3
"""TJB City Ledger — one canonical city pipeline state + dashboard export.

Commands:
  sync                         Consolidate all known sources and export dashboard JSON
  summary                      Print compact counts from canonical ledger
  claim --size 5 [--strategy closest-to-100]
                               Claim a 3-5 city batch and export dashboard JSON

Writable canonical source:
  ~/.hermes/state/tjb-city-ledger.json

Dashboard export:
  /Users/socializerender/Projects/truejoybirthing-website/public/city-audit.json
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import tempfile
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import fcntl  # POSIX advisory file lock (macOS/Linux) for worker concurrency guard

HOME = Path.home()
PROJECT_DIR = Path(os.environ.get("TJB_PROJECT_DIR", str(Path(__file__).resolve().parent.parent)))
BRAND_DIR = Path(os.environ.get("TJB_BRAND_DIR", "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing"))
STATE_DIR = HOME / ".hermes" / "state"
LEDGER_PATH = STATE_DIR / "tjb-city-ledger.json"
DASHBOARD_PATH = PROJECT_DIR / "public" / "city-audit.json"
CITY_STATUS_PATH = STATE_DIR / "tjb-city-status.json"
QUEUE_PATH = STATE_DIR / "tjb-pipeline-queue.json"
STATE_AUDIT_PATH = STATE_DIR / "tjb-city-audit.json"
REPO_STATUS_PATH = PROJECT_DIR / "tjb-city-status.json"
BRAND_STATUS_PATH = BRAND_DIR / "tjb-city-status.json"
PRIORITY_CSV_PATH = BRAND_DIR / "city-priority-list.csv"
CITIES_TS_PATH = PROJECT_DIR / "src" / "data" / "cities.ts"
VIDEO_EMBEDS_PATH = PROJECT_DIR / "src" / "data" / "video-embeds.ts"
STATE_MACHINE_DIR = HOME / ".hermes" / "skills" / "productivity" / "tjb-city-orchestrator" / "states"
WORKER_LOCK_PATH = STATE_DIR / "tjb-worker.lock"


def acquire_worker_lock(timeout: float = 5.0) -> Any:
    """Acquire an exclusive advisory lock guarding the claim path.

    Two concurrent cron fires (or a manual session + cron) trying to claim the
    same batch cannot both succeed: the second blocks until the first releases.
    Returns the open lock file handle (caller must close to release). Raises
    RuntimeError if the lock cannot be acquired within timeout.
    """
    WORKER_LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    lock_file = open(WORKER_LOCK_PATH, "a+")
    deadline = time.time() + timeout
    while True:
        try:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            return lock_file
        except (BlockingIOError, OSError):
            if time.time() >= deadline:
                lock_file.close()
                raise RuntimeError(
                    f"Could not acquire worker lock {WORKER_LOCK_PATH} within {timeout}s. "
                    "Another TJB worker is already running. Skipping claim to avoid double-work."
                )
            time.sleep(0.2)

BASE_FIELDS = ["hero", "og", "support", "hospitals", "doulas", "video", "outreach"]
STAGE_RANK = {"video_outreach": 0, "verify_deploy": 1, "enrich": 2, "build": 3, "blocked": 4, "complete": 9}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def atomic_write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text())
    except Exception:
        return default


def slug_to_city_state(slug: str) -> tuple[str, str]:
    parts = slug.split("-")
    if len(parts) < 2:
        return slug.title(), ""
    state = parts[-1].upper()
    city = " ".join(parts[:-1]).title()
    return city, state


def base_record(slug: str) -> dict[str, Any]:
    city, state = slug_to_city_state(slug)
    return {
        "slug": slug,
        "city": city,
        "state": state,
        "score": 0,
        "stage": "build",
        "hero": False,
        "hero_issue": "",
        "og": False,
        "support": False,
        "hospitals": False,
        "hospital_count": 0,
        "doulas": False,
        "doula_count": 0,
        "video": False,
        "outreach": False,
        "placeholder": False,
        "in_progress": False,
        "started_at": "",
        "slot": "",
        "batch_id": "",
        "blocked_reason": None,
        "url": f"https://truejoybirthing.com/birth-support/{slug}/",
    }


def normalize_stage(row: dict[str, Any]) -> str:
    # A city is only "complete" when it is ACTUALLY complete: video AND outreach
    # both done. Do NOT trust the status file's stage=="complete" blindly — a
    # city whose outreach was reset to false (or never sent) must stay in
    # video_outreach so the worker picks it up. This is the stranding bug fix.
    #
    # IMPORTANT (root-cause fix): promotion to "complete" must be FIELD-based,
    # not score-based. score_from_fields() runs AFTER this (in the caller's else
    # branch), so a fully-complete city (all 7 base fields true) can carry a
    # stale score <100 at this point and was previously dropped back to its
    # state-file stage (video_outreach/verify_deploy) instead of being promoted.
    if row.get("blocked_reason"):
        return "blocked"
    # All content fields done + outreach sent == genuinely complete.
    all_fields = all(row.get(f) for f in ["hero", "og", "support", "hospitals", "doulas", "video", "outreach"])
    if all_fields:
        return "complete"
    if not row.get("hero") or not row.get("og") or not row.get("support"):
        return "build"
    if not row.get("hospitals") or not row.get("doulas"):
        return "enrich"
    if not row.get("video") or not row.get("outreach"):
        return "video_outreach"
    return row.get("stage") or "verify_deploy"


def score_from_fields(row: dict[str, Any]) -> int:
    if row.get("stage") == "complete":
        return 100
    done = sum(1 for f in BASE_FIELDS if row.get(f))
    # Preserve the dashboard's coarse scoring style: 5/7 tends to display as 70.
    coarse = int(round((done / len(BASE_FIELDS)) * 10) * 10)
    return min(100, max(0, coarse))


def parse_cities_ts() -> dict[str, dict[str, Any]]:
    if not CITIES_TS_PATH.exists():
        return {}
    text = CITIES_TS_PATH.read_text(errors="ignore")
    matches = list(re.finditer(r'^\s*"([a-z]+(?:-[a-z]+)*-[a-z]{2})"\s*:\s*\{', text, re.M))
    out: dict[str, dict[str, Any]] = {}
    for i, m in enumerate(matches):
        slug = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        block = text[start:end]
        city, state = slug_to_city_state(slug)
        city_m = re.search(r'city\s*:\s*"([^"]+)"', block)
        state_m = re.search(r'state\s*:\s*"([^"]+)"', block)
        providers = len(re.findall(r'localDoulas\s*:\s*\[', block)) > 0
        provider_count = 0
        lm = re.search(r'localDoulas\s*:\s*\[(.*?)\]\s*,', block, re.S)
        if lm:
            provider_count = len(re.findall(r'\{\s*name\s*:', lm.group(1)))
        hm = re.search(r'hospitalDetails\s*:\s*\[(.*?)\]\s*,', block, re.S)
        hospital_count = len(re.findall(r'\{\s*name\s*:', hm.group(1))) if hm else 0
        bm = re.search(r'birthCenterDetails\s*:\s*\[(.*?)\]\s*,', block, re.S)
        birth_center_count = len(re.findall(r'\{\s*name\s*:', bm.group(1))) if bm else 0
        out[slug] = {
            "slug": slug,
            "city": city_m.group(1) if city_m else city,
            "state": state_m.group(1) if state_m else state,
            "hero": bool(re.search(r'heroImage\s*:\s*"/[^"]+"', block)),
            "og": bool(re.search(r'ogImage\s*:\s*"[^"]+"', block)),
            "support": bool(re.search(r'supportSceneImage\s*:\s*"/[^"]+"', block)),
            "hospitals": hospital_count > 0,
            "hospital_count": hospital_count,
            "birth_center_count": birth_center_count,
            "doulas": providers and provider_count > 0,
            "doula_count": provider_count,
        }
    return out


def parse_video_embeds() -> set[str]:
    if not VIDEO_EMBEDS_PATH.exists():
        return set()
    text = VIDEO_EMBEDS_PATH.read_text(errors="ignore")
    return set(re.findall(r'"([a-z]+(?:-[a-z]+)*-[a-z]{2})"\s*:\s*\{[^}]*videoId\s*:\s*"[A-Za-z0-9_-]+"', text, re.S))


def merge_status_record(row: dict[str, Any], status: dict[str, Any]) -> None:
    stage = status.get("stage") or status.get("current_stage")
    if stage:
        row["stage"] = "verify_deploy" if stage == "needs_gate_fix" else ("complete" if stage == "done" else stage)
    for src, dest in [
        ("has_video", "video"), ("video", "video"),
        ("has_outreach", "outreach"), ("outreach", "outreach"),
        ("provider_count", "doula_count"), ("providers_total", "doula_count"),
        ("hospital_count", "hospital_count"), ("hospitals_total", "hospital_count"),
        ("birth_center_count", "birth_center_count"), ("birth_centers_total", "birth_center_count"),
    ]:
        # IMPORTANT (P0-5 root cause): a status file is an OVERRIDE/annotation,
        # NOT the authority for code-derived truth (cities.ts content, video-embeds.ts
        # embed presence). A falsy value in a status file (e.g. has_video: False)
        # must never clobber a truthy value already set from authoritative code
        # truth. Only write when the source value is truthy, OR when the
        # destination is currently empty/unknown and we can fill it in.
        if src in status and status[src] not in (None, ""):
            current = row.get(dest)
            if status[src] or current in (None, "", False, 0):
                row[dest] = status[src]
    if row.get("doula_count", 0):
        row["doulas"] = True
    if row.get("hospital_count", 0):
        row["hospitals"] = True
    for k in ["video_id", "videoId", "youtube_id"]:
        if status.get(k):
            row["video_id"] = status[k]
            row["video"] = True
    if status.get("blocked_reason") or status.get("outreach_blocked_reason"):
        row["blocked_reason"] = status.get("blocked_reason") or status.get("outreach_blocked_reason")
    if status.get("completed_at"):
        row["completed_at"] = status["completed_at"]
    if isinstance(status.get("score"), int):
        row["score"] = max(row.get("score", 0), status["score"])


def consolidate() -> dict[str, Any]:
    records: dict[str, dict[str, Any]] = {}
    sources: list[str] = []

    # 1. Dashboard export, if present, is the broadest visual source today.
    dashboard = load_json(DASHBOARD_PATH, [])
    if isinstance(dashboard, list):
        sources.append(str(DASHBOARD_PATH))
        for item in dashboard:
            slug = item.get("slug")
            if slug:
                row = base_record(slug)
                row.update(item)
                records[slug] = row

    # 2. Codebase cities.ts: actual city content inventory.
    code_cities = parse_cities_ts()
    if code_cities:
        sources.append(str(CITIES_TS_PATH))
        for slug, info in code_cities.items():
            row = records.setdefault(slug, base_record(slug))
            for k, v in info.items():
                if k in ("city", "state") or row.get(k) in (None, "", False, 0):
                    row[k] = v

    # 3. Video embeds: code truth for embedded video presence.
    embedded = parse_video_embeds()
    if embedded:
        sources.append(str(VIDEO_EMBEDS_PATH))
        for slug in embedded:
            row = records.setdefault(slug, base_record(slug))
            row["video"] = True

    # 4. Priority CSV: priority/planned inventory + population metadata.
    if PRIORITY_CSV_PATH.exists():
        sources.append(str(PRIORITY_CSV_PATH))
        with PRIORITY_CSV_PATH.open(newline="") as f:
            for item in csv.DictReader(f):
                slug = item.get("slug")
                if not slug:
                    continue
                row = records.setdefault(slug, base_record(slug))
                row["city"] = row.get("city") or item.get("city") or slug_to_city_state(slug)[0]
                row["state"] = row.get("state") or item.get("state_abbr") or slug_to_city_state(slug)[1]
                for k in ["rank", "population", "tier", "build_status", "upgrade_status", "video_status", "medicaid_doula_coverage"]:
                    if item.get(k) not in (None, ""):
                        row[k] = item[k]
                if item.get("upgrade_status") == "Denver-level":
                    row["score"] = max(row.get("score", 0), 100)
                if item.get("video_status") == "live":
                    row["video"] = True

    # 5. Status sources. The SINGLE canonical status file is
    #    ~/.hermes/state/tjb-city-status.json (CITY_STATUS_PATH). The repo and
    #    brand-dir copies (REPO_STATUS_PATH, BRAND_STATUS_PATH) were stale and
    #    OVERRODE the canonical file on merge — that caused real stranding bugs
    #    (P0-5). We read ONLY the canonical file now. STATE_AUDIT and QUEUE are
    #    distinct artifacts (dashboard audit export / pipeline queue) and remain
    #    separate read-only inputs where present.
    for path in [CITY_STATUS_PATH, STATE_AUDIT_PATH, QUEUE_PATH]:
        data = load_json(path, {})
        if not data:
            continue
        sources.append(str(path))
        city_map: dict[str, Any] = {}
        if isinstance(data, dict) and isinstance(data.get("cities"), dict):
            city_map.update(data["cities"])
            for k, v in data.items():
                if re.match(r'^[a-z]+(?:-[a-z]+)*-[a-z]{2}$', k) and isinstance(v, dict):
                    city_map[k] = v
        elif isinstance(data, dict):
            city_map = {k: v for k, v in data.items() if isinstance(v, dict) and re.match(r'^[a-z]+(?:-[a-z]+)*-[a-z]{2}$', k)}
        for slug, status in city_map.items():
            row = records.setdefault(slug, base_record(slug))
            merge_status_record(row, status)

    # 6. Per-city state-machine files: current operational locks/stage truth.
    if STATE_MACHINE_DIR.exists():
        sources.append(str(STATE_MACHINE_DIR))
        for p in STATE_MACHINE_DIR.glob("*.json"):
            slug = p.stem
            status = load_json(p, {})
            if not isinstance(status, dict) or not re.match(r'^[a-z]+(?:-[a-z]+)*-[a-z]{2}$', slug):
                continue
            row = records.setdefault(slug, base_record(slug))
            merge_status_record(row, status)
            current = status.get("current_stage")
            if current and current != "complete":
                # State files are durable history, not proof of an active worker.
                # Only show the dashboard pulse for fresh work; stale states still
                # contribute stage truth but do not look "running" forever.
                updated = int(status.get("updated_at") or status.get("started_at") or 0)
                fresh = updated and (time.time() - updated) < 6 * 60 * 60
                if fresh:
                    row["in_progress"] = True
                    row["started_at"] = str(status.get("started_at") or row.get("started_at") or "")

    # The website's cities.ts is the sole inventory authority. Sidecar files
    # may contribute progress annotations, but they must never add planned,
    # stale, or migrated cities to the dashboard count.
    if code_cities:
        records = {slug: records[slug] for slug in code_cities if slug in records}

    # Normalize rows.
    for slug, row in records.items():
        row["slug"] = slug
        row.setdefault("url", f"https://truejoybirthing.com/birth-support/{slug}/")
        # Dashboard pulse is operational, not historical. If a row carried
        # in_progress from an old export, clear it unless freshly claimed.
        if row.get("in_progress"):
            started = row.get("started_at")
            fresh = False
            try:
                if isinstance(started, (int, float)) or (isinstance(started, str) and started.isdigit()):
                    fresh = (time.time() - int(started)) < 6 * 60 * 60
                elif isinstance(started, str) and started:
                    dt = datetime.fromisoformat(started.replace("Z", "+00:00"))
                    fresh = (datetime.now(timezone.utc) - dt).total_seconds() < 6 * 60 * 60
            except Exception:
                fresh = False
            if not fresh:
                row["in_progress"] = False
                row["slot"] = ""
        row["stage"] = normalize_stage(row)
        if row["stage"] == "complete":
            row["score"] = 100
            row["hero"] = row["og"] = row["support"] = row["hospitals"] = row["doulas"] = True
            row["video"] = bool(row.get("video", True))
            row["outreach"] = bool(row.get("outreach", True))
        else:
            # NOT complete — always recompute the score from actual fields.
            # Never preserve a stale score (e.g. a cached 100) that would hide
            # an incomplete city from the worker's "score < 100" pick.
            row["score"] = score_from_fields(row)
        row["updated_at"] = now_iso()

    cities = sorted(records.values(), key=lambda r: (-(r.get("score") or 0), r.get("rank", "999999"), r["slug"]))
    ledger = {
        "version": 1,
        "updated_at": now_iso(),
        "canonical": str(LEDGER_PATH),
        "dashboard_export": str(DASHBOARD_PATH),
        "sources": sorted(set(sources)),
        "summary": {
            "total": len(cities),
            "complete": sum(1 for c in cities if c.get("score") == 100),
            "in_progress": sum(1 for c in cities if c.get("in_progress")),
            "blocked": sum(1 for c in cities if c.get("stage") == "blocked"),
            "scores": dict(sorted(Counter(c.get("score", 0) for c in cities).items(), key=lambda x: int(x[0]))),
            "stages": dict(Counter(c.get("stage", "unknown") for c in cities)),
        },
        "cities": {c["slug"]: c for c in cities},
        "events": load_json(LEDGER_PATH, {}).get("events", [])[-500:] if LEDGER_PATH.exists() else [],
    }
    return ledger


def dashboard_rows(ledger: dict[str, Any]) -> list[dict[str, Any]]:
    rows = list(ledger["cities"].values())
    keep = [
        "slug", "city", "state", "score", "stage", "hero", "hero_issue", "og", "support",
        "hospitals", "hospital_count", "doulas", "doula_count", "video", "outreach",
        "placeholder", "in_progress", "started_at", "slot", "batch_id", "blocked_reason", "url",
    ]
    out = []
    for r in rows:
        item = {k: r.get(k) for k in keep if k in r}
        for k in BASE_FIELDS + ["placeholder", "in_progress"]:
            item[k] = bool(item.get(k))
        item["score"] = int(item.get("score") or 0)
        item.setdefault("hero_issue", "")
        item.setdefault("started_at", "")
        item.setdefault("slot", "")
        item.setdefault("url", f"https://truejoybirthing.com/birth-support/{item['slug']}/")
        out.append(item)
    return sorted(out, key=lambda r: (-(r.get("score") or 0), r.get("slug", "")))


def sync() -> dict[str, Any]:
    ledger = consolidate()
    atomic_write_json(LEDGER_PATH, ledger)
    atomic_write_json(DASHBOARD_PATH, dashboard_rows(ledger))
    return ledger


def claim(size: int, strategy: str) -> dict[str, Any]:
    if size < 3 or size > 5:
        raise SystemExit("Claim size must be 3–5.")
    # P0-3: guard against concurrent workers claiming overlapping batches.
    lock_file = acquire_worker_lock()
    try:
        ledger = sync()
        batch_id = f"batch-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
        rows = list(ledger["cities"].values())
        candidates = [r for r in rows if r.get("score", 0) < 100 and not r.get("in_progress") and r.get("stage") != "blocked"]
        if strategy == "closest-to-100":
            candidates.sort(key=lambda r: (-(r.get("score") or 0), STAGE_RANK.get(r.get("stage"), 9), int(r.get("rank") or 999999), r["slug"]))
        else:
            candidates.sort(key=lambda r: (int(r.get("rank") or 999999), -(r.get("score") or 0), r["slug"]))
        picked = candidates[:size]
        ts = now_iso()
        for i, row in enumerate(picked, 1):
            stored = ledger["cities"][row["slug"]]
            stored["in_progress"] = True
            stored["batch_id"] = batch_id
            stored["slot"] = str(i)
            stored["started_at"] = ts
            ledger["events"].append({"type": "claim", "slug": row["slug"], "batch_id": batch_id, "slot": i, "created_at": ts})
        ledger["updated_at"] = ts
        ledger["summary"]["in_progress"] = sum(1 for c in ledger["cities"].values() if c.get("in_progress"))
        atomic_write_json(LEDGER_PATH, ledger)
        atomic_write_json(DASHBOARD_PATH, dashboard_rows(ledger))
        return {"batch_id": batch_id, "cities": [{"slot": i + 1, "slug": r["slug"], "score": r.get("score"), "stage": r.get("stage")} for i, r in enumerate(picked)]}
    finally:
        lock_file.close()


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("sync")
    sub.add_parser("summary")
    cp = sub.add_parser("claim")
    cp.add_argument("--size", type=int, default=5)
    cp.add_argument("--strategy", choices=["closest-to-100", "priority"], default="closest-to-100")
    args = ap.parse_args()

    if args.cmd == "sync":
        ledger = sync()
        print(json.dumps({"ok": True, "ledger": str(LEDGER_PATH), "dashboard": str(DASHBOARD_PATH), "summary": ledger["summary"]}, indent=2))
    elif args.cmd == "summary":
        ledger = sync()
        print(json.dumps(ledger["summary"], indent=2))
    elif args.cmd == "claim":
        print(json.dumps(claim(args.size, args.strategy), indent=2))


if __name__ == "__main__":
    main()
