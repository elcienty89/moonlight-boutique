$backupFile = "c:\Users\LeoGhost\Desktop\Boutique\backup_20251125_131231\index.html"
$targetFile = "c:\Users\LeoGhost\Desktop\Boutique\index.html"

# Read the backup file
$content = Get-Content $backupFile -Raw -Encoding UTF8

# Find the Premium button line and add the Accesorios button after it
$premiumPattern = '(\s*<button id="catPremium" class="filter-btn" onclick="filterByCategory\(''Premium''\)">Premium ✨</button>)'
$replacement = '$1' + "`r`n" + '          <button id="catAccesorios" class="filter-btn" onclick="filterByCategory(''Accesorios'')">Accesorios</button>'

# Perform the replacement
$newContent = $content -replace $premiumPattern, $replacement

# Write to target file
[System.IO.File]::WriteAllText($targetFile, $newContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ Successfully added Accesorios button"
