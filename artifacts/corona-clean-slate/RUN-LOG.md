# Corona, CA — Clean-Slate Test (Local Models End-to-End)

**Started:** 2026-08-21 16:50:59 MDT
**Seed (object contract for subagents):**
- City: Corona, CA (slug: `corona-ca`)
- Population: ~157,000 (100K-500K tier) → requires 2+ doulas, 2+ hospitals, 1+ birth center
- Goal: run the ENTIRE 4-stage pipeline from zero context using local models only.
- This is a TEST of local-model reliability: which local model fails, at which stage, why, and whether we can fix it to run clean.

## Timer
- Start epoch: `1787352659`
- End-to-end = complete stage (`status` shows `complete`) minus start.

## Local model routing (per delegation-router.py)
- TJB worker tasks (build/enrich/extract with birth/doula city vocab) → **local Atlas `atlas:latest` @ localhost:11434**, lane `required-tjb-enrichment-local`, 180s timeout, NOT metered.
- Quality-writing (emails/outreach) → cloud Ring (quality-writing-openrouter).
- Orchestrator (this session) → cloud large-context.

## Stage log (chronological)
| # | Stage | Model | Start | End | Dur | Result |
|---|-------|-------|-------|-----|-----|--------|
| 1 | build | Atlas (local) | 16:52:23 | 16:56:34 | 4m11s | **FAILED — empty result.** Routed correctly to local Atlas (`required-tjb-enrichment-local -> atlas:latest`), but made only 7 API calls, wrote NOTHING. Read schema, then tried a nested-shell python heredoc via execute_code → SyntaxError quoting bug → model said "falling back to terminal" then **finalized as `completed` instead of actually retrying**. Zero artifacts: no cities.ts entry, no checkpoint, no images. Classic bounded-model give-up-on-first-error / false-complete. |
| 2 | research (build sub) | Atlas (local) | 16:59:12 | 17:07:11 | 7m59s | **FAILED — content not persisted (same class).** Write-first rule WORKED (checkpoint created as tool #1 ✓), did real web research in-context (found birth centers + Corona Regional L&D closure), but finalizded as `completed` with the checkpoint's every section still "pending research." The findings died in its context — never written to disk. Less catastrophic than #1 (artifact header exists) but the delivery is still lost. → **Recovered research in-session via direct bornbir/findbirthingcenters/minimalistmama extraction; persisted to RESEARCH.md myself.** |
| 3 | build-data-entry | Kit (in-session) | ~17:12 | ~17:45 | ~33m | **RECOVERED.** Wrote full corona-ca block to cities.ts from verified research; fixed schema (birth-center fields), FAQ quote-escapes, and a missing trailing comma (the parse blocker — corona's closing `}` lacked `,`). `cities.ts` now **PARSE OK** (esbuild); `validate-city-data corona-ca` = **0 errors**, only expected image gaps remain (hero/-skyline filename note + support/OG not yet created).

## KEY FINDING — answers Jeff's Qwen3-8/27b Q (2026-08-21)
- `atlas:latest` is **qwen35-family, 27.3B Q4_K_M** (confirmed `ollama list`). Both clean-slate failures ran on it.
- Root cause of BOTH failures is **NOT raw capability** — Atlas *reasoned correctly* (found the 3 real Corona birth centers, the Corona Regional L&D closure, and named real doulas). The failure is **execution discipline on the write path**: (1) quits on the 1st quoting error and false-announces completion, (2) gathers good content in-context but never persists it before finalizing.
- So the fix isn't "swap models" it's **structural**: write-first + verify-on-disk + keep early artifacts small + don't hand bounded local workers a 20KB context bomb. I injected those HARD WORKER RULES into ALL 4 stages (tjb-pipeline-state.py). Regrading the Qwen3 8b/27b you've heard about: worth testing — a swap is cheap and the discipline rules will carry over — but expect the same class of write-path weakness; the structural fix, not the model, is doing the heavy lifting.

## Failure #2 Root Cause (BUILD research, Atlas)
- **Model:** local `atlas:latest` (router ROUTE confirmed `required-tjb-enrichment-local -> atlas:latest`).
- **When:** after tool #1 (checkpoint mkdir — correctly done) + 3 web_searches + 1 web_extract that returned the bornbir list.
- **Why:** the model gathered real findings into its context but never issued the tool call to APPEND them to the checkpoint before finalizing. Same underlying bounded-model weakness as #1: it loses the thread between "I know the answer in my head" and "write it to disk." Write-first helps artifacts *exist*, but not *content persistence*.
- **Confirmed fix direction (being applied):** for local-model research workers, the content must be captured structured (e.g., the parent passes source URLs, the worker fills a fixed template) OR the research runs in-session where Kit persists immediately. Long free-form generation is the failure window for Atlas.

## Failure #1 Root Cause (BUILD, Atlas)
- **Model:** local `atlas:latest` (confirmed by router ROUTE log `required-tjb-enrichment-local -> atlas:latest`).
- **When:** blew on the first data-entry attempt (a nested double-quoted python heredoc through execute_code).
- **Why:** Atlas was given the FULL 20KB recurring-mistakes block + a sprawling goal → spent context on reads (read schema, cities.ts), then on the 1st write attempt hit a quoting error and **declared success with nothing on disk** instead of recovering (its own transcript literally reads "falling back to terminal" then ends). This is the exact read-first/never-write + false-complete failure mode the clean-slate test is designed to isolate.
- **Must fix before retry:** (1) do reads in-session and hand the affected code/schema as context, (2) instruct the worker to WRITE FIRST (checkpoint as tool #1), (3) use plain `terminal` for the cities.ts heredoc (never nested execute_code quotes), (4) split build into smaller sub-agents (research → data-entry → images) per the proven Elk Grove decomposition.

## Corollary (RESOLVED — not a bug, struck)
I initially flagged `_in_flight_ollama` as leaking. Verified: it decrements in the `finally` of Handler.do_POST on every local path (line 1341). No leak. Struck as a phantom.