@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js 22 o superiore non trovato.& pause & exit /b 1)
if not exist node_modules call npm.cmd install
call npm.cmd run build || (echo Build non riuscita.& pause & exit /b 1)
start "" http://localhost:8000
call npm.cmd start
if errorlevel 1 pause
