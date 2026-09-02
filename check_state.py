import re

with open("src/data/cities.ts") as f:
    content = f.read()

# Find all city entries and extract state value
issues = []
for match in re.finditer(r'"([a-z-]+)":\s*\{', content):
    slug = match.group(1)
    start = match.end()
    # Look for state field in next 3000 chars
    snippet = content[start:start+3000]
    state_match = re.search(r'state:\s*"([^"]*)"', snippet)
    if state_match:
        state_val = state_match.group(1)
        if not state_val:
            issues.append(f"{slug}: empty state")
    else:
        issues.append(f"{slug}: NO STATE FIELD")

# Also check for state: undefined or state: null
for match in re.finditer(r'"([a-z-]+)":\s*\{', content):
    slug = match.group(1)
    start = match.end()
    snippet = content[start:start+3000]
    if re.search(r'state:\s*(undefined|null)\s*,', snippet):
        issues.append(f"{slug}: state is undefined/null")

print(f"Issues found: {len(issues)}")
for i in issues:
    print(f"  {i}")
