# Clean fix - remove malformed line and add it correctly
$content = Get-Content "index.html" -Raw -Encoding UTF8

# Remove the malformed gallery.js line (it's part of promotions line)
$content = $content -replace '(<script src="promotions\.js"></script>).*?(<script src="gallery\.js"></script>)', '$1'

# Now add clean gallery.js line
$content = $content -replace '(<script src="promotions\.js"></script>)', "`$1`r`n  <script src=`"gallery.js`"></script>"

# Write back
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $content, $utf8)

Write-Host "✅ Cleaned and added gallery.js properly!" -ForegroundColor Green
