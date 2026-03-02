' Silently launches MegaRAG without showing a console window
Dim wsh
Set wsh = CreateObject("WScript.Shell")
wsh.Run "cmd /c """ & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\start-megarag.bat""", 0, False
Set wsh = Nothing
