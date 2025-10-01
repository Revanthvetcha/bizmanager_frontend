# Complete BizManager Startup Script
Write-Host "🚀 Starting BizManager with Database Fix..." -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
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

# Stop any existing backend processes
Write-Host "🛑 Stopping any existing backend processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*backend*" -or $_.CommandLine -like "*src/index.js*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Change to backend directory
Set-Location "C:\Users\vetch\OneDrive\Desktop\InternshipFL\BITMANAGER\backend"

# Create .env file
Write-Host "📝 Creating environment configuration..." -ForegroundColor Yellow
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

Write-Host "✅ Environment file created" -ForegroundColor Green

# Setup database
Write-Host "🗄️ Setting up database tables..." -ForegroundColor Yellow
node setup-database.js

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "   Backend will run on: http://localhost:4000" -ForegroundColor Cyan
Write-Host "   Health check: http://localhost:4000/api/ping" -ForegroundColor Cyan
Write-Host ""

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\vetch\OneDrive\Desktop\InternshipFL\BITMANAGER\backend"
    node src/index.js
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test backend connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/ping" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend started successfully!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend failed to start. Please check manually:" -ForegroundColor Red
    Write-Host "   cd backend && node src/index.js" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 Starting frontend development server..." -ForegroundColor Green
Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Change back to root directory and start frontend
Set-Location "C:\Users\vetch\OneDrive\Desktop\InternshipFL\BITMANAGER"
npm run dev
