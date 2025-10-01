# Complete Fix and Start Script for BizManager
Write-Host "🔧 Fixing BizManager Database and Starting Application..." -ForegroundColor Green
Write-Host ""

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

# Start the backend
node src/index.js
