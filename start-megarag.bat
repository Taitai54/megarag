@echo off
title MegaRAG - Starting
cd /d "%~dp0"

REM Ensure logs directory exists
if not exist logs mkdir logs

REM Check if already running on port 3000
netstat -ano | findstr ":3000 " | findstr "LISTENING" >NUL 2>&1
if %ERRORLEVEL%==0 (
    echo MegaRAG is already running on port 3000.
    timeout /t 2 >NUL
    exit /b 0
)

echo Starting MegaRAG server in background...
start "MegaRAG Server" /min cmd /c "npm run dev >> logs\megarag.log 2>&1"

REM Wait until port 3000 is listening (up to ~30 seconds)
set /a tries=0
:wait_loop
timeout /t 2 >NUL
netstat -ano | findstr ":3000 " | findstr "LISTENING" >NUL 2>&1
if %ERRORLEVEL%==0 goto started
set /a tries+=1
if %tries% lss 15 goto wait_loop
echo WARNING: MegaRAG may not have started. Check logs\megarag.log
goto done

:started
echo MegaRAG is running at http://localhost:3000
:done
echo Log: %~dp0logs\megarag.log
timeout /t 2 >NUL
