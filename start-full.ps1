# Complete BizManager Startup Script
Write-Host "🚀 Starting BizManager Complete Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if backend is already running
Write-Host "🔍 Checking backend status..." -ForegroundColor Yellow
if (Test-Port -Port 4000) {
    Write-Host "✅ Backend is already running on port 4000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend is not running. Starting backend..." -ForegroundColor Red
    
    # Start backend in background
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "C:\Users\vetch\OneDrive\Desktop\InternshipFL\BITMANAGER\backend"
        
        # Create .env file if it doesn't exist
        if (-not (Test-Path ".env")) {
            @"
# Local Development Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bizmanager
DB_PORT=3306

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-bizmanager-2024

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
"@ | Out-File -FilePath ".env" -Encoding UTF8
        }
        
        # Start the backend
        node src/index.js
    }
    
    Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Test backend connection
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/api/ping" -UseBasicParsing -TimeoutSec 3
        Write-Host "✅ Backend started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend failed to start. Please check manually:" -ForegroundColor Red
        Write-Host "   cd backend && node src/index.js" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Starting frontend development server..." -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""

# Start frontend
npm run dev
