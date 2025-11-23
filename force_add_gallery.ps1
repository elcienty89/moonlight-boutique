# Manual fix for gallery.js missing
$file = Get-Content "index.html" -Raw -Encoding UTF8

# Check if gallery.js is there
if ($file -notlike "*gallery.js*") {
    Write-Host "⚠️ gallery.js NOT found - adding it now..." -ForegroundColor Yellow
    
    # Add gallery.js line after promotions.js line
    $file = $file -replace '(<script src="promotions\.js"></script>)', '$1`r`n  <script src="gallery.js"></script>'
    
    # Save with UTF-8
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $file, $utf8)
    
    Write-Host "✅ gallery.js added successfully!" -ForegroundColor Green
}
else {
    Write-Host "✅ gallery.js already exists" -ForegroundColor Green
}
