with open("src/data/cities.ts") as f:
    lines = f.readlines()

# Line 682 (0-indexed 681) is `    },` which closes midwifeInfo
# It needs to be `    }},` to close both midwifeInfo and carrollton-tx
# But we need to be careful - there might be other `    },` lines

# Find the exact line
target_line = 681  # 0-indexed, line 682 in 1-indexed
if lines[target_line].strip() == "},":
    lines[target_line] = "    }},\n"
    with open("src/data/cities.ts", "w") as f:
        f.writelines(lines)
    print(f"Fixed line {target_line+1}: changed to close both midwifeInfo and carrollton-tx")
else:
    print(f"Line {target_line+1} is: {repr(lines[target_line])}")
