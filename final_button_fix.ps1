# Fix with exact string found
$content = Get-Content "index.html" -Raw -Encoding UTF8

# Replace the exact malformed string
$content = $content -replace 'CONSULTAR VÃƒÂA WHATSAPP', 'DISPONIBILIDAD'
$content = $content -replace 'CONSULTAR VÃA WHATSAPP', 'DISPONIBILIDAD'
$content = $content -replace 'CONSULTAR VÍA WHATSAPP', 'DISPONIBILIDAD'

# Write back
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $content, $utf8)

Write-Host "✅ DISPONIBILIDAD aplicado correctamente!" -ForegroundColor Green
