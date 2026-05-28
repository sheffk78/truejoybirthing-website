#!/usr/bin/env python3
"""Fix raw unicode characters in batch 9 city entries to use JS escape sequences."""

with open("src/data/cities.ts", "r") as f:
    content = f.read()

# Find the batch 9 section  
start_marker = '  "bridgeport-ct": {'
start_idx = content.find(start_marker)

if start_idx == -1:
    print("ERROR: Could not find bridgeport-ct start marker")
    exit(1)

# The section ends at the erie-pa closing + nearbyCities line
# Find "pittsburgh-pa"], that's followed by the closing of erie-pa
end_search = content.find('nearbyCities: ["pittsburgh-pa"]', start_idx)
if end_search == -1:
    print("ERROR: Could not find erie-pa end marker")
    exit(1)

# Find the next "  },\n" after this nearbyCities line
end_idx = content.find("\n  },\n", end_search)
if end_idx == -1:
    print("ERROR: Could not find erie-pa closing brace")
    exit(1)

end_idx += len("\n  },\n")  # include the closing brace

batch9 = content[start_idx:end_idx]

# Count replacements
replacements = 0

# Replace raw unicode with JS escape sequences
for raw, escaped in [
    ('\u2019', '\\u2019'),  # curly apostrophe
    ('\u2014', '\\u2014'),  # em dash
    ('\u201c', '\\u201c'),  # left smart quote  
    ('\u201d', '\\u201d'),  # right smart quote
    ('\u2013', '\\u2013'),  # en dash
    ('\u2018', '\\u2018'),  # left single quote
]:
    count = batch9.count(raw)
    replacements += count
    batch9 = batch9.replace(raw, escaped)

# Also fix inner double quotes in href attributes
# Replace <a href="/birth-plan-template/"> with <a href=\"/birth-plan-template/\">
# But these are already using raw " which breaks JS strings
# The pattern is: \"text <a href=\"/birth-plan-template/\">text</a> text\"
# Inside a double-quoted JS string, " must be \"
batch9 = batch9.replace('<a href="/birth-plan-template/">', '<a href=\\"/birth-plan-template/\\">')

new_content = content[:start_idx] + batch9 + content[end_idx:]

with open("src/data/cities.ts", "w") as f:
    f.write(new_content)

print(f"Fixed {replacements} unicode replacements in batch 9 section")
print(f"Section: {start_idx} to {end_idx} ({end_idx - start_idx} chars)")