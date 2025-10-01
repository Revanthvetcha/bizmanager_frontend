# Database Setup Script for BizManager
Write-Host "🔧 Setting up BizManager Database..." -ForegroundColor Green
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

# Run database setup
Write-Host "🗄️ Setting up database tables..." -ForegroundColor Yellow
node setup-database.js

Write-Host ""
Write-Host "🎉 Database setup completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MySQL is running" -ForegroundColor White
Write-Host "2. Run: .\start-full.ps1" -ForegroundColor White
Write-Host "3. Test registration and login" -ForegroundColor White
