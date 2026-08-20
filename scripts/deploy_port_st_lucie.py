import sys
sys.path.insert(0, '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website')
import subprocess

# Deploy port-st-lucie-fl
result = subprocess.run(
    ["bash", "scripts/deploy.sh", "port-st-lucie-fl"],
    cwd="/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website",
    capture_output=True,
    text=True,
    timeout=120
)

print("Deploy output:")
print(result.stdout)
print("\nDeploy exit code:", result.returncode)