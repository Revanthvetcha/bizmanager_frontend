# BizManager - Complete Setup Guide

This guide will help you set up the complete BizManager application with both frontend and backend.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
Make sure MySQL is running, then run:
```bash
npm run setup
```

This will:
- Create the `bizmanager` database
- Create all required tables
- Insert sample data
- Set up the default admin user

### 4. Environment Configuration
```bash
cp env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=bizmanager
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 5. Start Backend Server
```bash
npm run dev
```

The backend API will be available at `http://localhost:4000`

## Frontend Setup

### 1. Navigate to Root Directory
```bash
cd ..
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **stores** - Business locations
- **employees** - Employee records
- **products** - Inventory items
- **sales** - Sales transactions
- **expenses** - Business expenses
- **payroll** - Employee payroll records

## Default Login Credentials

After running the setup, you can login with:
- **Email**: admin@bizmanager.com
- **Password**: password

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Data Management
- `GET /api/stores` - Get all stores
- `GET /api/employees` - Get all employees
- `GET /api/sales` - Get all sales
- `GET /api/expenses` - Get all expenses
- `GET /api/inventory` - Get all products
- `GET /api/payroll` - Get all payroll records

## Features

### ✅ Completed Features
- 🔐 JWT Authentication with bcrypt password hashing
- 👥 User profile management
- 🏪 Multi-store management
- 👨‍💼 Employee management system
- 💰 Sales tracking and management
- 📊 Expense tracking
- 📦 Inventory management
- 💼 Payroll system
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

### 🔧 Technical Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: MySQL
- **Authentication**: JWT + bcrypt
- **API**: RESTful API design

## Troubleshooting

### Backend Issues
1. **Database Connection Error**: Check MySQL is running and credentials are correct
2. **Port Already in Use**: Change PORT in .env file
3. **JWT Secret Missing**: Set JWT_SECRET in .env file

### Frontend Issues
1. **API Connection Error**: Ensure backend is running on port 4000
2. **CORS Issues**: Check FRONTEND_URL in backend .env file
3. **Build Errors**: Clear node_modules and reinstall

### Database Issues
1. **Permission Denied**: Ensure MySQL user has CREATE privileges
2. **Table Already Exists**: Drop database and run setup again
3. **Connection Timeout**: Check MySQL server status

## Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
npm run dev  # Hot reload on changes
```

### Database Reset
```bash
cd backend
npm run setup  # Recreate database and tables
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production database
4. Use PM2 for process management

### Frontend
1. Build for production: `npm run build`
2. Serve static files with nginx
3. Configure HTTPS

## Support

For issues and questions:
1. Check the console for error messages
2. Verify all services are running
3. Check database connectivity
4. Review environment variables

## Next Steps

1. Customize the application for your business needs
2. Add more features as required
3. Set up proper backup procedures
4. Configure monitoring and logging
5. Deploy to production environment

---

**Happy Coding! 🚀**
