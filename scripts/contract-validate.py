#!/usr/bin/env python3
"""TJB handoff contract validator — fail-closed software check of subagent handoffs.

Usage:
  python3 scripts/contract-validate.py {slug} {stage}                 # validate
  python3 scripts/contract-validate.py {slug} {stage} --scaffold      # write skeleton
  python3 scripts/contract-validate.py {slug} {stage} --compare       # auto-fill + validate against live cities.ts

Exit codes (match preflight-stage-gate.py):
  0 = contract valid
  1 = retryable (contract missing/invalid → re-spawn worker with violations)
  3 = fatal (contract contradicts reality in a way that needs a human)

Phase 1 of the TJB Pipeline Harness Plan (Agency OS Layer 2).
"The agent does not get to invent its own definition of done."
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tjb_contracts import (  # noqa: E402
    PROJECT_DIR, STAGES, COST_RANGE_RE, URL_RE, YT_ID_RE, ISO_TS_RE,
    GENERIC_PROVIDER_NAMES, city_block, field, array_blocks, arr_field,
    image_on_disk, contract_path, load_contract, contract_skeleton,
)

LIVE_URL = "https://truejoybirthing.com/cities/{slug}/"


# ---------------------------------------------------------------- helpers

def fail(violations, level):
    """Print result JSON and exit with the mapped code."""
    code = 3 if level == "fatal" else 1
    print(json.dumps({
        "contract_valid": False,
        "level": level,
        "exit_code": code,
        "violations": violations,
        "hint": "Re-spawn the stage worker with these violations appended to its context. "
                "Worker must fix the contract file at artifacts/handoffs/{slug}/{stage}.json.",
    }, indent=2))
    sys.exit(code)


def req(cond, msg, violations, level="retryable"):
    if not cond:
        violations.append(msg)
    return cond


def check_sources(sources, violations, min_count=3):
    """Evidence contract: real URLs + non-empty quotes; >=1 per provider at build."""
    req(isinstance(sources, list) and len(sources) >= min_count,
        f"sources: need >= {min_count} evidence items, got {len(sources) if isinstance(sources, list) else type(sources).__name__}",
        violations)
    if not isinstance(sources, list):
        return
    for i, s in enumerate(sources):
        if not isinstance(s, dict):
            violations.append(f"sources[{i}]: not an object")
            continue
        claim = (s.get("claim") or "").strip()
        url = (s.get("url") or "").strip()
        quote = (s.get("quote") or "").strip()
        req(len(claim) >= 10, f"sources[{i}].claim: too short (<10 chars): '{claim[:40]}'", violations)
        req(bool(re.match(URL_RE, url)), f"sources[{i}].url: not a valid http(s) URL: '{url[:60]}'", violations)
        req(len(quote) >= 20, f"sources[{i}].quote: non-empty supporting quote required (got {len(quote)} chars)", violations)


def check_ts(violations, produced_at):
    req(isinstance(produced_at, str) and re.match(ISO_TS_RE, produced_at or ""),
        f"produced_at: required ISO timestamp, got: {produced_at!r}", violations)


# ---------------------------------------------------------------- stage validators

def validate_build(c, b, violations):
    cf = c.get("city_fields") or {}
    for k in ("city", "state", "heroImage", "ogImage", "supportSceneImage", "supportSceneAlt"):
        v = cf.get(k)
        req(isinstance(v, str) and v.strip(), f"city_fields.{k}: required, got {v!r}", violations)
    for k in ("lat", "lng", "costLow", "costHigh"):
        v = cf.get(k)
        req(isinstance(v, (int, float)) and not isinstance(v, bool), f"city_fields.{k}: required number, got {v!r}", violations)
    req(isinstance(cf.get("culture"), str) and len(cf.get("culture", "")) >= 200,
        f"city_fields.culture: required >= 200 chars (got {len(cf.get('culture') or '')})", violations)
    req(isinstance(cf.get("medicaidNote"), str) and len(cf.get("medicaidNote", "")) >= 30,
        "city_fields.medicaidNote: required >= 30 chars", violations)

    req(isinstance(c.get("faqs_count"), int) and c["faqs_count"] >= 4,
        f"faqs_count: required >= 4, got {c.get('faqs_count')}", violations)
    req(isinstance(c.get("midwife_paragraph_chars"), int) and c["midwife_paragraph_chars"] >= 400,
        f"midwife_paragraph_chars: required >= 400, got {c.get('midwife_paragraph_chars')}", violations)

    doulas = c.get("doulas")
    req(isinstance(doulas, list) and len(doulas) >= 1, "doulas: need >= 1 provider entries", violations)
    names = []
    if isinstance(doulas, list):
        for i, d in enumerate(doulas):
            if not isinstance(d, dict):
                violations.append(f"doulas[{i}]: not an object")
                continue
            name = (d.get("name") or "").strip()
            req(len(name) >= 3 and name.lower() not in GENERIC_PROVIDER_NAMES,
                f"doulas[{i}].name: real business/person name required, got '{name}'", violations)
            url = (d.get("url") or "").strip()
            req(bool(re.match(URL_RE, url)), f"doulas[{i}].url: valid http(s) URL required, got '{url[:60]}'", violations)
            photo = (d.get("photo") or "").strip()
            ok, detail = image_on_disk(photo, c.get("slug", ""))
            req(ok, f"doulas[{i}].photo: {detail}", violations)
            req(isinstance(d.get("description_chars"), int) and d["description_chars"] >= 150,
                f"doulas[{i}].description_chars: required >= 150 (G14-class), got {d.get('description_chars')}", violations)
            req(isinstance(d.get("costRange"), str) and re.match(COST_RANGE_RE, d.get("costRange") or ""),
                f"doulas[{i}].costRange: dollar-range format required (e.g. '$1,800-$2,500'), got {d.get('costRange')!r}", violations)
            names.append(name.lower())

    imgs = c.get("images") or {}
    req(imgs.get("hero_watermark_clean") is True, "images.hero_watermark_clean: required true (flux watermark pipeline)", violations)
    req(imgs.get("og_watermark_clean") is True, "images.og_watermark_clean: required true (flux watermark pipeline)", violations)

    # evidence density: one source per provider (min 3)
    check_sources(c.get("sources"), violations, min_count=max(3, len(names) if names else 3))
    # provider names in contract should match cities.ts
    if b:
        live = [(field(o, "name") or "").strip().lower() for o in array_blocks(b, "localDoulas")]
        for n in names:
            req(n in live, f"doulas: '{n}' not found in cities.ts localDoulas — contract/data mismatch", violations)


def validate_enrich(c, b, violations):
    providers = c.get("providers")
    req(isinstance(providers, list) and len(providers) >= 1, "providers: need >= 1", violations)
    live_prov = []
    if b:
        for o in array_blocks(b, "localDoulas"):
            live_prov.append((field(o, "name") or "").strip().lower())
    if isinstance(providers, list):
        for i, p in enumerate(providers):
            if not isinstance(p, dict):
                violations.append(f"providers[{i}]: not an object")
                continue
            name = (p.get("name") or "").strip()
            req(len(name) >= 3 and name.lower() not in GENERIC_PROVIDER_NAMES,
                f"providers[{i}].name: real name required, got '{name}'", violations)
            req(name.lower() in live_prov, f"providers[{i}]: '{name}' not in cities.ts localDoulas — mismatch", violations)
            photo = (p.get("photo") or "").strip()
            ok, detail = image_on_disk(photo, c.get("slug", ""))
            req(ok, f"providers[{i}].photo: {detail} (G15/G15b)", violations)
            req(isinstance(p.get("description_chars"), int) and p["description_chars"] >= 150,
                f"providers[{i}].description_chars: required >= 150, got {p.get('description_chars')}", violations)
            req(isinstance(p.get("costRange"), str) and re.match(COST_RANGE_RE, p.get("costRange") or ""),
                f"providers[{i}].costRange: dollar-range format required, got {p.get('costRange')!r} (G35/cost-format)", violations)
            req(isinstance(p.get("costRange_source"), str) and len(p["costRange_source"]) >= 3,
                f"providers[{i}].costRange_source: required provenance tag, got {p.get('costRange_source')!r}", violations)

    hospitals = c.get("hospitals")
    req(isinstance(hospitals, list) and len(hospitals) >= 1, "hospitals: need >= 1 (G9)", violations)
    if isinstance(hospitals, list):
        for i, h in enumerate(hospitals):
            if not isinstance(h, dict):
                violations.append(f"hospitals[{i}]: not an object")
                continue
            req(len((h.get("name") or "").strip()) >= 3, f"hospitals[{i}].name: required", violations)
            req(isinstance(h.get("paragraph_chars"), int) and h["paragraph_chars"] >= 300,
                f"hospitals[{i}].paragraph_chars: required >= 300 (hospital desc length gate), got {h.get('paragraph_chars')}", violations)
            thumb = (h.get("thumbnail") or "").strip()
            ok, detail = image_on_disk(thumb, c.get("slug", ""))
            req(ok, f"hospitals[{i}].thumbnail: {detail}", violations)

    bs = c.get("birthstats") or {}
    req(isinstance(bs.get("dataYear"), int) and 2015 <= bs["dataYear"] <= 2026,
        f"birthstats.dataYear: required int 2015-2026, got {bs.get('dataYear')}", violations)
    req(isinstance(bs.get("dataSource"), str) and len(bs["dataSource"]) >= 5,
        f"birthstats.dataSource: required, got {bs.get('dataSource')!r}", violations)

    check_sources(c.get("sources"), violations, min_count=3)


def validate_verify_deploy(c, b, violations, live_http=None):
    req(c.get("preflight_exit") == 0, f"preflight_exit: required 0, got {c.get('preflight_exit')}", violations)
    req(c.get("deploy_status") == "SUCCESS", f"deploy_status: required 'SUCCESS', got {c.get('deploy_status')!r}", violations)
    req(c.get("live_http") == 200, f"live_http: required 200, got {c.get('live_http')}", violations)
    vf = c.get("vision_verdict_file")
    req(isinstance(vf, str) and vf.strip(), "vision_verdict_file: required path to artifacts/gates/vision/{slug}.json", violations)
    if isinstance(vf, str):
        vpath = PROJECT_DIR / vf.lstrip("/") if not vf.startswith("artifacts") else PROJECT_DIR / vf
        if vpath.exists():
            try:
                vdata = json.loads(vpath.read_text())
                verdicts = vdata.get("crops") or vdata.get("verdicts") or {}
                # Two on-disk formats exist:
                #  - dict: {crop: {"pass": bool}} (legacy)
                #  - list: [{"crop": ..., "verdict": "pass|fail"}] — the format
                #    visual-verify-gate.py mandates and emits since 2026-09-05.
                if isinstance(verdicts, dict):
                    bad = [k for k, v in verdicts.items()
                           if isinstance(v, dict) and v.get("pass") is False]
                else:
                    bad = [v.get("crop", "?") for v in verdicts
                           if isinstance(v, dict) and v.get("verdict") != "pass"]
                req(not bad, f"vision verdicts failing: {bad[:5]}", violations)
            except json.JSONDecodeError:
                violations.append(f"vision_verdict_file: not valid JSON: {vf}")
        else:
            violations.append(f"vision_verdict_file: file not found: {vf}")


def validate_video_outreach(c, b, violations):
    # Mirror preflight G2/G3 semantics: the local mp4 is routinely cleaned up
    # after upload, so video_file is required ONLY when there is no registered
    # upload. If youtube_id binds to video-embeds.ts, absence is expected.
    yid = c.get("youtube_id")
    embeds = PROJECT_DIR / "src" / "data" / "video-embeds.ts"
    live_vid = None
    if embeds.exists() and isinstance(yid, str):
        etxt = embeds.read_text(errors="replace")
        block_m = re.search(rf'"{re.escape(c.get("slug", ""))}":\s*\{{', etxt)
        if block_m:
            vm = re.search(r'videoId:\s*"([^"]+)"', etxt[block_m.end():block_m.end() + 600])
            if vm and vm.group(1) != "PENDING":
                live_vid = vm.group(1)
    vid = c.get("video_file")
    if isinstance(vid, str) and vid.strip():
        vpath = Path(vid)
        if not vpath.is_absolute():
            vpath = PROJECT_DIR / vid
        if vpath.exists():
            mb = vpath.stat().st_size / (1024 * 1024)
            req(mb > 10, f"video_file: {mb:.1f}MB — must be > 10MB", violations)
            req(isinstance(c.get("video_mb"), (int, float)) and abs((c.get("video_mb") or 0) - mb) < 1,
                f"video_mb: claimed {c.get('video_mb')} but disk shows {mb:.1f}", violations)
        elif live_vid:
            pass  # post-upload cleanup — upload evidence governs
        else:
            violations.append(f"video_file: not found on disk and no registered upload: {vid}")
    else:
        req(live_vid is not None,
            "video_file: required (no local mp4 AND no registered upload in video-embeds.ts)", violations)
    req(isinstance(yid, str) and re.match(YT_ID_RE, yid or ""), f"youtube_id: required 11-char video ID, got {yid!r}", violations)
    if live_vid:
        req(live_vid == yid, f"youtube_id: contract says {yid}, video-embeds.ts says {live_vid}", violations)
    elif isinstance(yid, str) and re.match(YT_ID_RE, yid or "") and embeds.exists():
        violations.append(f"youtube_id: {yid} not registered in video-embeds.ts for {c.get('slug')} (upload must land first)")
    thumb = c.get("thumbnail_path")
    req(isinstance(thumb, str) and thumb.strip(), "thumbnail_path: required", violations)
    if isinstance(thumb, str) and thumb.strip():
        tpath = Path(thumb)
        if not tpath.is_absolute():
            tpath = PROJECT_DIR / thumb
        req(tpath.exists(), f"thumbnail_path: not found on disk: {thumb}", violations)
    req(c.get("embed_verified") is True, "embed_verified: required true", violations)
    req(isinstance(c.get("outreach"), list), "outreach: required list (may be empty if blocked — record status)", violations)
    for i, o in enumerate(c.get("outreach") or []):
        if isinstance(o, dict) and o.get("status") in ("sent", "queued"):
            req(bool((o.get("message_id") or "").strip()),
                f"outreach[{i}]: sent/queued requires message_id (R41 proof of contact)", violations)


# ---------------------------------------------------------------- live-page check

def fetch_live_http(slug):
    try:
        req_ = urllib.request.Request(LIVE_URL.format(slug=slug), method="GET",
                                      headers={"User-Agent": "Mozilla/5.0 (TJB-contract-validate)"})
        with urllib.request.urlopen(req_, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return None


# ---------------------------------------------------------------- compare mode

def compare_mode(slug, stage, violations):
    """Auto-fill a draft contract from live cities.ts — the worker reviews,
    adds sources/timestamps, and fixes anything that can't be auto-filled.
    Software proposes, worker confirms; the validator still checks everything."""
    b = city_block(slug)
    if not b:
        fail([f"cities.ts has no entry for {slug}"], "fatal")
    sk = contract_skeleton(slug, stage)
    if stage == "build":
        cf = sk["city_fields"]
        for k in ("city", "state", "heroImage", "ogImage", "supportSceneImage",
                  "supportSceneAlt", "culture", "medicaidNote"):
            cf[k] = field(b, k)
        for k in ("lat", "lng", "costLow", "costHigh"):
            cf[k] = field(b, k)
        sk["faqs_count"] = len(array_blocks(b, "faqs"))
        sk["midwife_paragraph_chars"] = 0
        mid_m = re.search(r"midwifeInfo:\s*\{", b)
        if mid_m:
            seg = b[mid_m.end():]
            pm = re.search(r"paragraph:\s*\"((?:[^\"\\]|\\.)*)\"", seg)
            if pm:
                sk["midwife_paragraph_chars"] = len(pm.group(1))
        sk["doulas"] = []
        for o in array_blocks(b, "localDoulas"):
            nm = (field(o, "name") or "").strip()
            photo_m = re.search(r"photo:\s*[\"']([^\"']+)", o)
            url_m = re.search(r"url:\s*[\"']([^\"']+)", o)
            desc_m = re.search(r"description:\s*\"((?:[^\"\\]|\\.)*)\"", o)
            cost_m = re.search(r"costRange:\s*\"([^\"]+)\"", o)
            sk["doulas"].append({
                "name": nm,
                "url": url_m.group(1) if url_m else "",
                "photo": photo_m.group(1) if photo_m else "",
                "description_chars": len(desc_m.group(1)) if desc_m else 0,
                "costRange": cost_m.group(1) if cost_m else "",
            })
        imgs = []
        for k in ("heroImage", "ogImage", "supportSceneImage"):
            v = field(b, k)
            if v:
                imgs.append(v)
        sk["images"] = {"hero_watermark_clean": None, "og_watermark_clean": None}
        sk["_auto_image_refs"] = imgs
    elif stage == "enrich":
        sk["providers"] = []
        for o in array_blocks(b, "localDoulas"):
            nm = (field(o, "name") or "").strip()
            photo = re.search(r"photo:\s*[\"']([^\"']+)", o)
            desc = re.search(r"description:\s*\"((?:[^\"\\]|\\.)*)\"", o)
            cost = re.search(r"costRange:\s*\"([^\"]+)\"", o)
            src = re.search(r"costRange_source:\s*\"([^\"]+)\"", o)
            sk["providers"].append({
                "name": nm,
                "photo": photo.group(1) if photo else "",
                "description_chars": len(desc.group(1)) if desc else 0,
                "costRange": cost.group(1) if cost else "",
                "costRange_source": src.group(1) if src else "",
            })
        sk["hospitals"] = []
        for o in array_blocks(b, "hospitalDetails"):
            nm = (field(o, "name") or "").strip()
            para = re.search(r"paragraph:\s*\"((?:[^\"\\]|\\.)*)\"", o)
            thumb = re.search(r"thumbnail:\s*[\"']([^\"']+)", o)
            nicu = re.search(r"nicuLevel:\s*\"([^\"]+)\"", o)
            url = re.search(r"url:\s*[\"']([^\"']+)", o)
            sk["hospitals"].append({
                "name": nm,
                "paragraph_chars": len(para.group(1)) if para else 0,
                "thumbnail": thumb.group(1) if thumb else "",
                "nicuLevel": nicu.group(1) if nicu else "",
                "url": url.group(1) if url else "",
            })
        sk["birth_centers"] = []
        for o in array_blocks(b, "birthCenterDetails"):
            nm = (field(o, "name") or "").strip()
            para = re.search(r"paragraph:\s*\"((?:[^\"\\]|\\.)*)\"", o)
            thumb = re.search(r"thumbnail:\s*[\"']([^\"']+)", o)
            sk["birth_centers"].append({
                "name": nm, "paragraph_chars": len(para.group(1)) if para else 0,
                "thumbnail": thumb.group(1) if thumb else "",
            })
        by = re.search(r"dataYear:\s*(\d{4})", b)
        dsr = re.search(r"dataSource:\s*\"([^\"]+)\"", b)
        sk["birthstats"] = {"dataYear": int(by.group(1)) if by else None,
                            "dataSource": dsr.group(1) if dsr else None}
    elif stage == "video_outreach":
        vi = field(b, "videoId") or field(b, "youtubeId")
        if vi:
            sk["youtube_id"] = vi
            sk["embed_verified"] = True
    return sk


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("stage")
    ap.add_argument("--scaffold", action="store_true", help="write skeleton contract if missing")
    ap.add_argument("--compare", action="store_true", help="auto-fill from cities.ts, save draft, validate")
    args = ap.parse_args()
    stage = args.stage
    if stage not in STAGES:
        print(f"Unknown stage: {stage}. Valid: {STAGES}")
        sys.exit(1)

    if args.scaffold:
        p = contract_path(args.slug, stage)
        if not p.exists():
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(json.dumps(contract_skeleton(args.slug, stage), indent=2))
            print(json.dumps({"action": "scaffolded", "path": str(p)}, indent=2))
        else:
            print(json.dumps({"action": "exists", "path": str(p)}, indent=2))
        sys.exit(0)

    if args.compare:
        sk = compare_mode(args.slug, stage, [])
        p = contract_path(args.slug, stage)
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(sk, indent=2))
        print(json.dumps({"action": "compare_draft_written", "path": str(p),
                          "note": "worker must add produced_at, worker_model, sources, watermark flags; then re-run validate"}, indent=2))
        sys.exit(0)

    c, err = load_contract(args.slug, stage)
    violations = []
    if err:
        violations.append(err)
        fail(violations, "retryable")

    # meta
    req(c.get("slug") == args.slug, f"contract.slug mismatch: {c.get('slug')!r}", violations)
    req(c.get("stage") == stage, f"contract.stage mismatch: {c.get('stage')!r}", violations)
    check_ts(violations, c.get("produced_at"))
    req(isinstance(c.get("worker_model"), str) and len(c["worker_model"].strip()) >= 2,
        f"worker_model: required, got {c.get('worker_model')!r}", violations)

    b = city_block(args.slug)
    if not b:
        violations.append(f"cities.ts has no entry for {args.slug} — contract cannot bind to data")
        fail(violations, "fatal")

    if stage == "build":
        validate_build(c, b, violations)
    elif stage == "enrich":
        validate_enrich(c, b, violations)
    elif stage == "verify_deploy":
        validate_verify_deploy(c, b, violations)
    elif stage == "video_outreach":
        validate_video_outreach(c, b, violations)

    if violations:
        fail(violations, "retryable")

    print(json.dumps({
        "contract_valid": True,
        "slug": args.slug,
        "stage": stage,
        "exit_code": 0,
        "message": f"{stage} contract valid and bound to cities.ts",
    }, indent=2))
    sys.exit(0)


if __name__ == "__main__":
    main()