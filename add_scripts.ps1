# Add missing scripts to index.html before closing body tag
$html = Get-Content "index.html" -Raw -Encoding UTF8

# Check if scripts are already there
if ($html -notmatch "products\.js") {
    # Find the position right before </body>
    $scriptTags = @"
  <!-- Scripts -->
  <script src="products.js"></script>
  <script src="promotions.js"></script>
  <script src="gallery.js"></script>
  <script src="script.js"></script>

"@
    
    # Insert before </body>
    $html = $html -replace '</body>', "$scriptTags</body>"
    
    # Write back using UTF8
    $utf8NoBOM = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllLines((Join-Path (Get-Location) "index.html"), $html, $utf8NoBOM)
    
    Write-Host "✅ Scripts agregados exitosamente!" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Los scripts ya existen en el archivo" -ForegroundColor Yellow
}
