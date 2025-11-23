# Force change with more specific replacement
$content = Get-Content "index.html" -Raw -Encoding UTF8

# Replace both variations
$content = $content -replace 'CONSULTAR VÍA WHATSAPP', 'DISPONIBILIDAD'
$content = $content -replace 'CONSULTAR VÃA WHATSAPP', 'DISPONIBILIDAD'

# Write back
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $content, $utf8)

Write-Host "✅ Cambiado a DISPONIBILIDAD!" -ForegroundColor Green
