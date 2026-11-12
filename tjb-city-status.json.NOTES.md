# tjb-city-status.json — NOTES

> **DEPRECATION / STATUS NOTE — added 2026-11-10.**
>
> `tjb-city-status.json` (last updated 2026-09-17, 196-city `cities` snapshot) is **STALE and NOT the live state home**. The authoritative live-state home for the TJB city pipeline is the per-slug engine states: `~/.hermes/skills/productivity/tjb-city-orchestrator/states/{slug}.json` (written by `tjb-pipeline-state.py`, read by dispatch cron `1084dbb6ff47`, the completion monitor, and the worker watchdog). Cross-run aggregate: `~/.hermes/state/tjb-city-ledger.json`.
>
> This file is retained **only as an input to `SYSTEM/kit-os/mirror/ingest-cities.py`** (Kit-verified historical snapshot feeding the Command-Center /cities mirror + baked `repos/AgenticOS/frontend/src/data/citiesBoard.json`). Those outputs are derived mirrors — never edit them to change pipeline state; see the RECONCILIATION NOTE in `Kit/life/brands/TrueJoyBirthing/pipeline-index.md`.
>
> Canonical pipeline doc: `Kit/life/brands/TrueJoyBirthing/pipeline-index.md`.
