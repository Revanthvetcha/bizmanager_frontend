# PowerShell script to start backend properly
Write-Host "🚀 Starting BizManager Backend..." -ForegroundColor Green

# Change to backend directory
Set-Location "C:\Users\vetch\OneDrive\Desktop\InternshipFL\BITMANAGER\backend"

# Check if .env file exists, if not create one
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file for local development..." -ForegroundColor Yellow
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
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Start the backend server
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
node src/index.js
