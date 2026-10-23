#!/usr/bin/env python3
"""test-sync-city-pipeline.py — tests for scripts/sync-city-pipeline.py.

Run:  python3 scripts/test-sync-city-pipeline.py
Exit: 0 = all tests passed, 1 = a test failed.

Pure stdlib, no third-party test runner, so it works in CI and on a laptop
with nothing but python3 installed.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "sync-city-pipeline.py"
PROJECT_ROOT = SCRIPT.parent.parent

sys.path.insert(0, str(SCRIPT.parent))
import importlib.util

_spec = importlib.util.spec_from_file_location("sync_city_pipeline", SCRIPT)
assert _spec is not None and _spec.loader is not None
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)  # type: ignore[attr-defined]
sync = _mod  # type: ignore[assignment]


def run_sync(ledger: Path, output: Path, cities: Path | None = None):
    """Run the sync script with env overrides; return (exit_code, stdout, stderr)."""
    env = dict(os.environ)
    env["TJB_PIPELINE_LEDGER"] = str(ledger)
    env["TJB_PIPELINE_OUTPUT"] = str(output)
    if cities is not None:
        env["TJB_PIPELINE_CITIES"] = str(cities)
    proc = subprocess.run(
        [sys.executable, str(SCRIPT)], env=env, capture_output=True, text=True
    )
    return proc.returncode, proc.stdout, proc.stderr


class SyncPipelineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="tjb-sync-test-"))
        self.ledger = self.tmp / "ledger.json"
        self.output = self.tmp / "city-pipeline.json"
        self.cities = self.tmp / "cities.ts"

    def write_ledger(self, cities: dict):
        self.ledger.write_text(json.dumps({"version": 1, "cities": cities}))

    def read_output(self):
        return json.loads(self.output.read_text())

    # ── Guard: the build must never break ──────────────────────────────
    def test_missing_ledger_writes_empty_and_exits_zero(self):
        code, out, _ = run_sync(self.tmp / "does-not-exist.json", self.output)
        self.assertEqual(code, 0, "missing ledger must not fail the build")
        self.assertEqual(self.read_output(), {})
        self.assertIn("0 city page(s)", out)

    def test_malformed_ledger_writes_empty_and_exits_zero(self):
        self.ledger.write_text("{ not json at all")
        code, _, _ = run_sync(self.ledger, self.output)
        self.assertEqual(code, 0)
        self.assertEqual(self.read_output(), {})

    def test_ledger_without_cities_key_writes_empty(self):
        self.ledger.write_text(json.dumps({"version": 1}))
        code, _, _ = run_sync(self.ledger, self.output)
        self.assertEqual(code, 0)
        self.assertEqual(self.read_output(), {})

    def test_output_is_written_even_when_empty(self):
        run_sync(self.tmp / "nope.json", self.output)
        self.assertTrue(self.output.exists(), "output file must always exist")
        self.assertEqual(self.output.read_text().strip(), "{}")

    # ── Selection rules ───────────────────────────────────────────────
    def test_only_in_progress_non_complete_rows_are_kept(self):
        self.write_ledger({
            "dallas-tx": {"in_progress": True, "stage": "enrich", "started_at": "T1"},
            "austin-tx": {"in_progress": False, "stage": "enrich", "started_at": "T2"},
            "houston-tx": {"in_progress": True, "stage": "complete", "started_at": "T3"},
            "irving-tx": {"in_progress": True, "stage": "build", "started_at": "T4"},
        })
        code, _, _ = run_sync(self.ledger, self.output)
        self.assertEqual(code, 0)
        data = self.read_output()
        self.assertEqual(sorted(data), ["dallas-tx", "irving-tx"])
        self.assertTrue(data["dallas-tx"]["inProgress"])
        self.assertEqual(data["dallas-tx"]["stage"], "enrich")
        self.assertEqual(data["dallas-tx"]["startedAt"], "T1")

    def test_unknown_slugs_are_skipped(self):
        self.write_ledger({
            "dallas-tx": {"in_progress": True, "stage": "enrich", "started_at": "T1"},
            "not-a-real-city-zz": {"in_progress": True, "stage": "enrich", "started_at": "T2"},
        })
        # cities.ts is a real file in the project, so dallas-tx is valid.
        run_sync(self.ledger, self.output, cities=PROJECT_ROOT / "src" / "data" / "cities.ts")
        data = self.read_output()
        self.assertIn("dallas-tx", data)
        self.assertNotIn("not-a-real-city-zz", data)

    def test_truthy_in_progress_variants(self):
        self.write_ledger({
            "dallas-tx": {"in_progress": "true", "stage": "enrich"},
            "austin-tx": {"in_progress": 1, "stage": "enrich"},
            "houston-tx": {"in_progress": True, "stage": "enrich"},
            "irving-tx": {"in_progress": "no", "stage": "enrich"},
        })
        run_sync(self.ledger, self.output)
        data = self.read_output()
        self.assertIn("dallas-tx", data)
        self.assertIn("austin-tx", data)
        self.assertIn("houston-tx", data)
        self.assertNotIn("irving-tx", data)

    def test_stage_is_normalised_to_lowercase(self):
        self.write_ledger({"dallas-tx": {"in_progress": True, "stage": "ENRICH"}})
        run_sync(self.ledger, self.output)
        self.assertEqual(self.read_output()["dallas-tx"]["stage"], "enrich")

    # ── Milestone copy ─────────────────────────────────────────────────
    def test_milestone_text_per_stage(self):
        expected = {
            "build": "Research and images are being added",
            "enrich": "Provider, hospital and cost details are being enriched",
            "verify_deploy": "Final checks and publishing are in progress",
            "video_outreach": "A city video is being produced",
        }
        for stage, phrase in expected.items():
            self.write_ledger({"dallas-tx": {"in_progress": True, "stage": stage}})
            run_sync(self.ledger, self.output)
            self.assertEqual(
                self.read_output()["dallas-tx"]["nextMilestone"], phrase, stage
            )

    def test_unknown_stage_gets_generic_milestone(self):
        self.write_ledger({"dallas-tx": {"in_progress": True, "stage": "weird"}})
        run_sync(self.ledger, self.output)
        self.assertEqual(
            self.read_output()["dallas-tx"]["nextMilestone"],
            "This page is being updated",
        )

    # ── Determinism ────────────────────────────────────────────────────
    def test_output_is_deterministic_and_sorted(self):
        rows = {
            "houston-tx": {"in_progress": True, "stage": "enrich", "started_at": "T"},
            "austin-tx": {"in_progress": True, "stage": "build", "started_at": "T"},
            "dallas-tx": {"in_progress": True, "stage": "video_outreach", "started_at": "T"},
        }
        self.write_ledger(rows)
        run_sync(self.ledger, self.output)
        first = self.output.read_text()
        run_sync(self.ledger, self.output)
        second = self.output.read_text()
        self.assertEqual(first, second, "repeated runs must produce identical bytes")
        keys = list(json.loads(first).keys())
        self.assertEqual(keys, sorted(keys), "keys must be sorted")
        self.assertTrue(first.endswith("\n"), "file must end with a newline")

    # ── cities.ts parsing ──────────────────────────────────────────────
    def test_parse_city_slugs_matches_runtime_list(self):
        """The parser must find exactly the slugs Astro renders.

        cities.ts nests objects (birthStats, midwifeInfo) at the same
        indentation as their parent city, so an indentation-based scan
        would report them as cities. The parser tracks brace depth.
        """
        parsed = sync.parse_city_slugs(PROJECT_ROOT / "src" / "data" / "cities.ts")
        self.assertIsNotNone(parsed)
        self.assertNotIn("birthStats", parsed)
        self.assertNotIn("midwifeInfo", parsed)
        self.assertIn("dallas-tx", parsed)
        self.assertIn("irving-tx", parsed)
        self.assertGreater(len(parsed), 150)

    def test_parse_city_slugs_returns_none_when_unreadable(self):
        self.assertIsNone(sync.parse_city_slugs(self.tmp / "missing.ts"))

    def test_slug_filter_disabled_when_cities_ts_unreadable(self):
        """An unreadable cities.ts must not silently drop every row."""
        self.write_ledger({
            "dallas-tx": {"in_progress": True, "stage": "enrich", "started_at": "T"},
        })
        code, _, err = run_sync(self.ledger, self.output, cities=self.tmp / "missing.ts")
        self.assertEqual(code, 0)
        self.assertIn("WARNING", err)
        self.assertIn("dallas-tx", self.read_output())

    # ── The real project's seed file ───────────────────────────────────
    def test_project_seed_json_is_valid(self):
        seed = PROJECT_ROOT / "src" / "data" / "city-pipeline.json"
        self.assertTrue(seed.exists(), "seed city-pipeline.json must exist in the repo")
        data = json.loads(seed.read_text())
        self.assertIsInstance(data, dict)
        for slug, entry in data.items():
            self.assertIn("inProgress", entry)
            self.assertIn("stage", entry)
            self.assertIn("startedAt", entry)
            self.assertIn("nextMilestone", entry)


if __name__ == "__main__":
    unittest.main(verbosity=2)
