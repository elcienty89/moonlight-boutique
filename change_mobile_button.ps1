# Change mobile button text carefully
$file = Get-Content "index.html" -Raw -Encoding UTF8

# Replace mobile button text
$file = $file -replace 'CONSULTAR VÃA WHATSAPP', 'DISPONIBILIDAD'

# Write back
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $file, $utf8)

Write-Host "✅ Texto del botón móvil cambiado!" -ForegroundColor Green
