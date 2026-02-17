# Copy hero image to assets. Run in PowerShell: .\copy-hero-image.ps1
$dest = Join-Path $PSScriptRoot "assets\hero-pc-dashboard.png"
$cursorAssets = Join-Path $env:USERPROFILE ".cursor\projects"
if (-not (Test-Path $cursorAssets)) {
    Write-Host "Cursor assets folder not found."
    exit 1
}
$found = Get-ChildItem -Path $cursorAssets -Recurse -Filter "*hero*PC*.png" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($found) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($found.FullName)
        [System.IO.File]::WriteAllBytes($dest, $bytes)
        Write-Host "Copied to: $dest"
    } catch {
        Write-Host "Copy failed. Please save your image manually as: assets\hero-pc-dashboard.png"
        exit 1
    }
} else {
    Write-Host "Hero image not found. Save your image as: assets\hero-pc-dashboard.png"
    exit 1
}
