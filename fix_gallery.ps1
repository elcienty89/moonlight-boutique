# Add gallery.js script carefully with PowerShell
$file = "index.html"
$content = Get-Content $file -Raw -Encoding UTF8

# Replace promotions.js line to include gallery.js after it
$content = $content -replace '(\s+<script src="promotions\.js"></script>)', '$1`r`n  <script src="gallery.js"></script>'

# Write back
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) $file), $content, $utf8)

Write-Host "✅ gallery.js agregado!" -ForegroundColor Green
