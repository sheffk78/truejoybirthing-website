#!/usr/bin/env python3
"""Stage 1 orchestrator for cedar-park-tx: scene data, assets, TTS, composition.
Imports functions from city-video-automation.py so we reuse the proven logic
without triggering its monolithic main() (which renders/deploys without the
pre-render gate and uses capture-fullpage.cjs instead of capture-provider-scroll.py).
"""
import sys, importlib.util, os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPT = PROJECT_ROOT / 'scripts' / 'city-video-automation.py'

spec = importlib.util.spec_from_file_location('cva', SCRIPT)
cva = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cva)

SLUG = 'cedar-park-tx'

# 1. City data
data = cva.get_city_data(SLUG)
print(f"City: {data['city']}, {data['state']} (full: {data['state_full']})")
print(f"Cost: ${data['cost_low']:,}-${data['cost_high']:,}  Medicaid: {data['is_medicaid']}")
print(f"Hospitals: {[h['name'] for h in data['hospitals']]}")
print(f"Providers: {[p['name'] for p in data['providers']]} (count={data['provider_count']})")
print(f"Birth center: {data['has_birth_center']}")

# 2. Scene data
df = cva.create_scene_data(data)
print("Scene data:", df)

# 3. Assets
cva.copy_assets(SLUG, data)

# 4. TTS
timing = cva.generate_tts(df)
if timing:
    print("Timing:", timing)
    cva.update_scene_durations(df, timing)

# 5. Register composition
cva.register_composition(SLUG, df)

print("\nSTAGE 1 COMPLETE")
