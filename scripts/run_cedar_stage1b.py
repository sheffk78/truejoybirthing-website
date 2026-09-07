#!/usr/bin/env python3
"""Regenerate TTS after narration text fixes, rebuild master WAV + durations."""
import importlib.util
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('cva', PROJECT_ROOT / 'scripts' / 'city-video-automation.py')
cva = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cva)

SLUG = 'cedar-park-tx'
df = cva.REMOTION_DIR / 'src' / 'data' / f'{SLUG}-data.ts'
timing = cva.generate_tts(df)
if timing:
    cva.update_scene_durations(df, timing)
    print("Updated durations. Total:", timing['total_duration'])
