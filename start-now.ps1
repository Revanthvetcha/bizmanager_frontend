# Quick Start Script for BizManager
Write-Host "🚀 Starting BizManager with Fixed Backend..." -ForegroundColor Green
Write-Host ""

# Stop any existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start backend
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "start-local-dev.js" -WorkingDirectory "backend" -WindowStyle Hidden

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/ping" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend is running successfully!" -ForegroundColor Green
    Write-Host "   Backend: http://localhost:4000" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Starting frontend..." -ForegroundColor Green
Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Start frontend
npm run dev