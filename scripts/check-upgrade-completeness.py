#!/usr/bin/env python3
"""
G7: Upgrade Completeness Check — Content Depth Gate

Usage: python3 scripts/check-upgrade-completeness.py {slug}
Exit 0 = pass, Exit 1 = fail
"""
import re, sys


def extract_array(src, start_marker):
    """Extract a balanced-bracket array starting at marker."""
    idx = src.find(start_marker)
    if idx == -1:
        return None
    rest = src[idx + len(start_marker):].lstrip()
    if not rest or rest[0] != '[':
        return None
    depth = 0
    in_str = False
    for i, c in enumerate(rest):
        if c == '"' and (i == 0 or rest[i-1] != '\\'):
            in_str = not in_str
        if not in_str:
            if c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return rest[1:i]
    return None


def main():
    slug = sys.argv[1] if len(sys.argv) > 1 else None
    if not slug:
        print("Usage: python3 scripts/check-upgrade-completeness.py {slug}")
        sys.exit(1)

    with open('src/data/cities.ts') as f:
        lines = f.readlines()

    # Find city block — line-by-line to avoid false positives
    found_idx = -1
    for i, line in enumerate(lines):
        if f'"{slug}": {{' in line:
            found_idx = i
            break

    if found_idx == -1:
        print(f"City {slug} not found")
        sys.exit(1)

    # Balance braces to isolate the block
    combined = ''.join(lines[found_idx:])
    brace_offset = combined.index('{')
    depth = 0
    end = 0
    for i in range(brace_offset, len(combined)):
        c = combined[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    city_block = combined[brace_offset:brace_offset + end]

    results = {'passes': [], 'warnings': [], 'failures': []}

    def check(label, condition, fail_msg):
        (results['passes'] if condition else results['failures']).append(
            f"{'✅' if condition else '❌'} {label if condition else fail_msg}")

    def warn(label, condition, msg):
        if condition:
            results['passes'].append(f"✅ {label}")
        else:
            results['warnings'].append(f"⚠️  {msg}")

    def has(field):
        return bool(re.search(rf'{field}:', city_block))

    def medicaid_starts_ok():
        # TS source stores em dashes as \\u2014 (double-escaped backslash + u2014)
        m = re.search(r'medicaidNote:\s*"(Yes|No)\s*\\u201[34]', city_block)
        return m is not None

    # ---- FIELD PRESENCE ----
    check('heroImage', has('heroImage'), 'Missing heroImage')
    check('enableBlogResources',
          bool(re.search(r'enableBlogResources:\s*true', city_block)),
          'enableBlogResources not set to true')
    check('ogImage', has('ogImage'), 'Missing ogImage')
    check('publishedDate', has('publishedDate'), 'Missing publishedDate')
    check('midwifeInfo', has('midwifeInfo'), 'Missing midwifeInfo')
    check('medicaidNote', medicaid_starts_ok(),
          'medicaidNote must start with "Yes —" or "No —"')
    check('FAQs', has('faqs'), 'Missing faqs')
    check('nearbyCities', has('nearbyCities'), 'Missing nearbyCities')
    check('lat/lng', has('lat') and has('lng'), 'Missing lat/lng')

    # ---- HOSPITAL DEPTH ----
    h_arr = extract_array(city_block, 'hospitalDetails:')
    if h_arr:
        h_count = h_arr.count('{')
        if h_count > 0:
            h_nicu = h_arr.count('nicuLevel:')
            h_addr = h_arr.count('address:')
            h_url = h_arr.count('url:')

            warn(f'Hospitals nicuLevel: {h_nicu}/{h_count}',
                 h_nicu >= h_count,
                 f'Only {h_nicu}/{h_count} hospitals have nicuLevel')
            warn(f'Hospitals address: {h_addr}/{h_count}',
                 h_addr >= h_count,
                 f'Only {h_addr}/{h_count} hospitals have addresses')
            warn(f'Hospitals url: {h_url}/{h_count}',
                 h_url >= h_count,
                 f'Only {h_url}/{h_count} hospitals have URLs')

            total = h_nicu + h_addr + h_url
            check(f'Hospital depth: {total}/{h_count * 3}',
                  total >= h_count * 2,
                  f'Hospitals bare-minimum ({total}/{h_count * 3})')
        else:
            results['passes'].append('✅ Hospital depth: empty array')
    else:
        results['failures'].append('❌ hospitalDetails missing')

    # ---- DOULA DEPTH ----
    d_arr = extract_array(city_block, 'localDoulas:')
    if d_arr:
        d_count = d_arr.count('{')
        d_svc = d_arr.count('services:')
        d_cost = d_arr.count('costRange:')
        d_photo = d_arr.count('photo:')

        check(f'Doula count: {d_count}', d_count >= 3,
              f'Only {d_count} doulas — Denver has 4+')

        if d_count > 0:
            warn(f'Doulas services: {d_svc}/{d_count}', d_svc >= d_count,
                 f'Only {d_svc}/{d_count} doulas have services')
            warn(f'Doulas costRange: {d_cost}/{d_count}',
                 d_cost >= max(1, d_count // 2),
                 f'Only {d_cost}/{d_count} doulas have costRange')
            warn(f'Doulas photos: {d_photo}/{d_count}',
                 d_photo >= max(1, d_count // 2),
                 f'Only {d_photo}/{d_count} doulas have photos')
    else:
        results['failures'].append('❌ localDoulas missing')

    # ---- REPORT ----
    print(f'\n{"=" * 45}')
    print(f'  G7: Upgrade Completeness Check')
    print(f'  Target: {slug}')
    print(f'{"=" * 45}\n')

    for group in ['passes', 'warnings', 'failures']:
        if results[group]:
            tag = {'passes': 'PASSES', 'warnings': 'WARNINGS',
                   'failures': 'FAILURES'}[group]
            print(f'── {tag} ({len(results[group])}) ──')
            for r in results[group]:
                print(f'  {r}')
            print()

    n_pass = len(results['passes'])
    n_warn = len(results['warnings'])
    n_fail = len(results['failures'])
    print(f'── SUMMARY ──')
    print(f'  {n_pass} passed, {n_warn} warnings, {n_fail} failures')

    if n_fail:
        print(f'\n❌ G7 FAILED — {n_fail} hard issues blocking deploy')
        sys.exit(1)
    elif n_warn:
        print(f'\n⚠️  G7 PASSED with {n_warn} warnings')
        sys.exit(0)
    else:
        print(f'\n✅ G7 FULL PASS')
        sys.exit(0)


if __name__ == '__main__':
    main()