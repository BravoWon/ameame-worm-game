$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
# extract inline game script and node --check it
$html = Get-Content (Join-Path $root "index.html") -Raw
$m = [regex]::Match($html, '(?s)<script(?![^>]*src=)[^>]*>(.*?)</script>')
Set-Content (Join-Path $root "test\_extracted.js") $m.Groups[1].Value -Encoding utf8
& node --check (Join-Path $root "test\_extracted.js"); if ($LASTEXITCODE){ Write-Host "SYNTAX FAIL"; exit 1 }
$tests = Get-ChildItem -Path (Join-Path $root "test") -Filter "*.test.js" | ForEach-Object { $_.FullName }
& node --test @tests; $code=$LASTEXITCODE
Remove-Item (Join-Path $root "test\_extracted.js") -ErrorAction SilentlyContinue
if ($code -eq 0){ Write-Host "VERIFY: all checks passed" } else { Write-Host "VERIFY: FAILED ($code)" }
exit $code
