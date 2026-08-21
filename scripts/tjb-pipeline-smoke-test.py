#!/usr/bin/env python3
"""
TJB Pipeline Smoke Test — verifies a city can pass all pipeline stage gates.

Usage:
    python3 scripts/tjb-pipeline-smoke-test.py rosemount-mn
    python3 scripts/tjb-pipeline-smoke-test.py --all

Exit code 0 = all stages pass, 1 = at least one failure.
"""
import subprocess
import sys
import os
import json
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
REMOTION_DIR = Path.home() / '.openclaw' / 'workspace' / 'Kit' / 'life' / 'brands' / 'TrueJoyBirthing' / 'video' / 'remotion'

STAGES = ['build', 'enrich', 'verify_deploy', 'video_outreach']


def run(cmd, timeout=180):
    """Run a command and return (exit_code, stdout, stderr)."""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout, cwd=str(PROJECT_DIR))
    return result.returncode, result.stdout, result.stderr


def check_stage_gate(slug, stage):
    """Run the stage gate for a city and report results."""
    print(f"\n{'='*50}")
    print(f"  Stage: {stage.upper()} — {slug}")
    print(f"{'='*50}")

    # Special checks for video_outreach
    if stage == 'video_outreach':
        return check_video_outreach(slug)

    # Run the gate script
    cmd = f'python3 scripts/preflight-stage-gate.py {slug} {stage}'
    exit_code, stdout, stderr = run(cmd, timeout=300)

    print(stdout)

    if exit_code == 0:
        print(f"  ✅ {stage.upper()} PASSED")
        return True
    else:
        print(f"  ❌ {stage.upper()} FAILED (exit {exit_code})")
        if stderr:
            print(f"  STDERR: {stderr[:500]}")
        return False


def check_video_outreach(slug):
    """Detailed video_outreach checks beyond the gate script."""
    all_pass = True
    checks = []

    # 1. Scene data exists
    scene_data = REMOTION_DIR / 'src' / 'data' / f'{slug}-data.ts'
    if scene_data.exists():
        checks.append(('✅', 'scene_data', f'exists ({scene_data.stat().st_size // 1024}KB)'))
    else:
        checks.append(('❌', 'scene_data', f'missing at {scene_data}'))
        all_pass = False

    # 2. TTS audio — all scene wavs + master.wav
    audio_dir = REMOTION_DIR / 'public' / 'audio' / slug
    if audio_dir.exists():
        wavs = list(audio_dir.glob('*.wav'))
        master = audio_dir / f'{slug}-master.wav'
        if master.exists():
            checks.append(('✅', 'tts_audio', f'{len(wavs)} wav files, master.wav present'))
        else:
            checks.append(('❌', 'tts_audio', f'{len(wavs)} wavs but master.wav missing'))
            all_pass = False
    else:
        checks.append(('❌', 'tts_audio', f'audio dir missing at {audio_dir}'))
        all_pass = False

    # 3. Video file >10MB
    video_file = REMOTION_DIR / 'out' / f'{slug}-city-guide.mp4'
    if video_file.exists():
        size_mb = video_file.stat().st_size / (1024 * 1024)
        if size_mb > 10:
            checks.append(('✅', 'video_file', f'{size_mb:.1f}MB >10MB'))
        else:
            checks.append(('❌', 'video_file', f'only {size_mb:.1f}MB (<10MB)'))
            all_pass = False
    else:
        checks.append(('❌', 'video_file', f'missing at {video_file}'))
        all_pass = False

    # 4. YouTube ID in video-embeds.ts
    embeds_file = PROJECT_DIR / 'src' / 'data' / 'video-embeds.ts'
    vid_id = None
    if embeds_file.exists():
        content = embeds_file.read_text()
        if f'"{slug}"' in content:
            import re
            slug_section = content[content.find(f'"{slug}"'):]
            m = re.search(r'videoId:\s*"([^"]*)"', slug_section)
            if m and m.group(1) and m.group(1) != 'PENDING':
                vid_id = m.group(1)
                checks.append(('✅', 'youtube_id', f'{vid_id} in video-embeds.ts'))
            else:
                checks.append(('❌', 'youtube_id', 'videoId is PENDING or missing'))
                all_pass = False
        else:
            checks.append(('❌', 'youtube_id', f'{slug} not in video-embeds.ts'))
            all_pass = False
    else:
        checks.append(('❌', 'youtube_id', 'video-embeds.ts not found'))
        all_pass = False

    # 5. Embed on live page
    if vid_id:
        try:
            result = subprocess.run(
                ['curl', '-s', f'https://truejoybirthing.com/birth-support/{slug}/'],
                capture_output=True, text=True, timeout=30
            )
            page = result.stdout
            if vid_id in page:
                checks.append(('✅', 'live_embed', f'videoId {vid_id} on live page'))
            else:
                checks.append(('❌', 'live_embed', f'videoId {vid_id} NOT on live page'))
                all_pass = False
            if 'VideoObject' in page and '"duration"' in page:
                checks.append(('✅', 'videoobject_schema', 'VideoObject+duration present'))
            else:
                checks.append(('❌', 'videoobject_schema', 'VideoObject schema missing'))
                all_pass = False
        except Exception as e:
            checks.append(('❌', 'live_embed', f'curl failed: {e}'))
            checks.append(('❌', 'videoobject_schema', f'curl failed: {e}'))
            all_pass = False
    else:
        checks.append(('⏭️', 'live_embed', 'skipped — no videoId'))
        checks.append(('⏭️', 'videoobject_schema', 'skipped — no videoId'))

    # 6. Thumbnail
    thumb = PROJECT_DIR / 'public' / 'images' / f'yt-thumb-{slug}.png'
    if thumb.exists():
        checks.append(('✅', 'thumbnail', f'present ({thumb.stat().st_size // 1024}KB)'))
    else:
        checks.append(('❌', 'thumbnail', f'missing'))
        all_pass = False

    # Print results
    for icon, check, msg in checks:
        print(f"  {icon} [{check}] {msg}")

    if all_pass:
        print(f"\n  ✅ VIDEO_OUTREACH PASSED")
    else:
        print(f"\n  ❌ VIDEO_OUTREACH FAILED")

    return all_pass


def get_pipeline_status(slug):
    """Get current pipeline stage for a slug."""
    cmd = f'python3 scripts/tjb-pipeline-state.py status {slug}'
    exit_code, stdout, stderr = run(cmd, timeout=10)
    if exit_code == 0:
        try:
            return json.loads(stdout)
        except json.JSONDecodeError:
            return None
    return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/tjb-pipeline-smoke-test.py <slug> [--all]")
        print("Example: python3 scripts/tjb-pipeline-smoke-test.py rosemount-mn")
        sys.exit(1)

    slug = sys.argv[1]

    print(f"\n{'#' * 60}")
    print(f"# TJB Pipeline Smoke Test — {slug}")
    print(f"{'#' * 60}")

    # Check pipeline state
    status = get_pipeline_status(slug)
    if status:
        current = status.get('current_stage', 'unknown')
        completed = status.get('stages_completed', [])
        print(f"\n  Pipeline state: {current}")
        print(f"  Stages completed: {', '.join(completed) if completed else 'none'}")
    else:
        print(f"\n  ⚠️  Could not read pipeline state (is {slug} initialized?)")

    # Run each stage gate
    results = {}
    for stage in STAGES:
        results[stage] = check_stage_gate(slug, stage)

    # Summary
    passed = sum(1 for r in results.values() if r)
    failed = sum(1 for r in results.values() if not r)

    print(f"\n{'#' * 60}")
    print(f"# SUMMARY: {passed}/{len(STAGES)} stages passed, {failed} failed")
    print(f"{'#' * 60}")

    for stage, result in results.items():
        icon = '✅' if result else '❌'
        print(f"  {icon} {stage}")

    sys.exit(0 if failed == 0 else 1)


if __name__ == '__main__':
    main()