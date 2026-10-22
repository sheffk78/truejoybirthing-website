# TJB City Rebuild Queue — Restore26 junk pages (2026-10-22)

**What happened:** The 26-page restore (July-snapshot recovery) graded all 30 lost pages.
15 graded good → restored and shipped live 2026-10-22 (commit f7ba4a7b, prod 200s verified).
The 11 below graded junk (≤50% real provider rosters, thin facility data) or empty
(wichita-falls-tx: zero providers) → **deleted from prod (404 verified), content NOT rebuilt
as-is.** They are queued for proper rebuild from scratch via the new-city pipeline
(`scripts/tjb-seed-new-cities.py` → research → build → gates), never a July-snapshot copy.

**July-snapshot raw data for each is preserved in-repo:** `artifacts/restore26/junk-archive/`.
Full triage detail: `artifacts/restore26/grade-report.json`.

| # | Slug | Grade reason | Live status |
|---|------|--------------|-------------|
| 1 | edinburg-tx | 2 doulas, both generic creds | 404 (deleted 2026-10-22) |
| 2 | mission-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 3 | harlingen-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 4 | mcallen-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 5 | grand-prairie-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 6 | greensboro-nc | ≤50% real roster | 301 (alt route; page removed from corpus) |
| 7 | pharr-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 8 | st-petersburg-fl | 2 doulas, thin content | 404 (deleted 2026-10-22) |
| 9 | mesquite-tx | ≤50% real roster | 404 (deleted 2026-10-22) |
| 10 | richardson-tx | 5 doulas all generic | 404 (deleted 2026-10-22) |
| 11 | wichita-falls-tx | zero providers | 404 (deleted 2026-10-22) |

**Rebuild rule (per restore26 triage):** research real providers first (min 3, specific
credentials from provider's own pages), then build fresh — July data here is reference only,
too junk to copy. Priority by Texas market value if Jeff wants them rebuilt: mcallen/mission/
edinburg/harlingen/pharr (Rio Grande Valley cluster), grand-prairie/richardson/mesquite
(DMetro fringe), greensboro/st-petersburg/wichita-falls last.
**UPDATE 2026-10-22 (Jeff directive):** all 11 enqueued into the city pipeline DAG
(`tjb-city-ledger.json`, stage=queued), priority-scored per Jeff's instruction:
RGV cluster first (mcallen 99 / mission 97 / edinburg 96 / harlingen 95 / pharr 94),
then DMetro fringe (grand-prairie 89 / richardson 88 / mesquite 87),
then the rest (greensboro 79 / st-petersburg-fl 78 / wichita-falls 77).
Kit claims them via `tjb-autonomous-runner.py run-next` — pop-only scores overridden.
