# Fix encoding script
$backup = Get-Content "backup\index.html" -Raw -Encoding UTF8
$fixed = $backup -replace 'COLECCIÃ"N','COLECCIÓN' `
                 -replace 'CategorÃ­as','Categorías' `
                 -replace 'ColecciÃ³n','Colección' `
                 -replace 'VÃA WHATSAPP','VÍA WHATSAPP'

# Write without BOM
$utf8WithoutBOM = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $fixed, $utf8WithoutBOM)

Write-Host "✅ Encoding issues fixed!" -ForegroundColor Green
