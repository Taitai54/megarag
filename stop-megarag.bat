@echo off
title MegaRAG - Stopping
cd /d "%~dp0"

echo Stopping MegaRAG server...

REM Kill any window titled "MegaRAG Server"
taskkill /FI "WINDOWTITLE eq MegaRAG Server" /F >NUL 2>&1

REM Kill any process listening on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo Killing PID %%a on port 3000
    taskkill /PID %%a /F >NUL 2>&1
)

echo MegaRAG stopped.
timeout /t 2 >NUL
