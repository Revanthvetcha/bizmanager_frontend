@echo off
echo Starting BizManager Development Environment...
echo.

echo Checking if backend is running...
curl -s http://localhost:4000/api/ping >nul 2>&1
if %errorlevel% neq 0 (
    echo Backend is not running. Starting backend server...
    start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"
    echo Waiting for backend to start...
    timeout /t 5 /nobreak >nul
) else (
    echo Backend is already running.
)

echo.
echo Starting frontend development server...
cd /d "%~dp0"
npm run dev

pause
