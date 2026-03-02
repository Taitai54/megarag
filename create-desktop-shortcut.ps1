# Creates a MegaRAG desktop shortcut pointing to the silent VBS launcher
$megaragDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$vbsPath    = Join-Path $megaragDir "launch-megarag-silent.vbs"
$iconPath   = Join-Path $megaragDir "public\favicon.ico"
$desktop    = [Environment]::GetFolderPath("Desktop")
$shortcut   = Join-Path $desktop "MegaRAG.lnk"

$wsh  = New-Object -ComObject WScript.Shell
$link = $wsh.CreateShortcut($shortcut)

$link.TargetPath       = "wscript.exe"
$link.Arguments        = "`"$vbsPath`""
$link.WorkingDirectory = $megaragDir
$link.Description      = "Start MegaRAG RAG server"

# Use favicon.ico if it exists, otherwise fall back to wscript icon
if (Test-Path $iconPath) {
    $link.IconLocation = "$iconPath,0"
} else {
    $link.IconLocation = "wscript.exe,0"
}

$link.Save()
Write-Host "Shortcut created: $shortcut"
