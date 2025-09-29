# Backend Setup Guide

## Quick Start

### 1. Create Environment File
```bash
# Create .env file in backend folder
cp env.example .env
```

### 2. Update .env file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_actual_mysql_password
DB_NAME=bizmanager
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database
```bash
npm run setup
```

### 4. Test Database Connection
```bash
npm run test-db
```

### 5. Start Backend
```bash
npm run dev
```

## What Each Command Does

- `npm run setup` - Creates database and tables
- `npm run test-db` - Tests database connection
- `npm run dev` - Starts backend server with auto-restart

## Expected Output

When you run `npm run dev`, you should see:
```
🚀 Starting BizManager Backend...
🔍 Testing database connection...
✅ Database connection successful
📊 Found tables: [users, stores, sales, expenses, employees, products, payroll]
👥 Users: 1
🏪 Stores: 1
🎉 Backend is ready!
📡 API will be available at: http://localhost:4000
Backend API listening on http://localhost:4000
```

## Troubleshooting

### Database Connection Error
1. Make sure MySQL is running
2. Check your password in .env file
3. Verify MySQL user has CREATE privileges

### Port Already in Use
1. Change PORT in .env file
2. Kill process using port 4000

### Missing Tables
1. Run `npm run setup` again
2. Check if database was created

## API Endpoints

Once running, your API will be available at:
- `http://localhost:4000/api/ping` - Health check
- `http://localhost:4000/api/auth/*` - Authentication
- `http://localhost:4000/api/stores/*` - Store management
- `http://localhost:4000/api/sales/*` - Sales tracking
- `http://localhost:4000/api/employees/*` - Employee management
- `http://localhost:4000/api/expenses/*` - Expense tracking
- `http://localhost:4000/api/inventory/*` - Inventory management
- `http://localhost:4000/api/payroll/*` - Payroll management

## Default Login

After setup, you can login with:
- Email: admin@bizmanager.com
- Password: password
