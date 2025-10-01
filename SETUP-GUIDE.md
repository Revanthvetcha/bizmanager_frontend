# BizManager Setup Guide

## Quick Start

### For Local Development

1. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Start Both Frontend and Backend**
   ```bash
   npm run start:full
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run start:backend
   
   # Terminal 2 - Frontend  
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### For Production Deployment

The application automatically detects the environment:
- **Local Development**: Uses `http://localhost:4000`
- **Production (Render)**: Uses `https://bitzmanager-py8.onrender.com`

## Troubleshooting

### Common Issues

#### 1. "Failed to fetch" Error
**Problem**: Frontend can't connect to backend
**Solution**: 
- Ensure backend is running on port 4000
- Check if MySQL database is running
- Verify database connection in backend

#### 2. CORS Errors in Production
**Problem**: Cross-origin requests blocked
**Solution**: 
- Backend CORS is configured for both local and production domains
- Check if backend is deployed and accessible

#### 3. Database Connection Issues
**Problem**: Backend can't connect to MySQL
**Solution**:
```bash
cd backend
npm run setup  # This will create the database and tables
```

### Manual Setup Steps

1. **Database Setup**
   ```bash
   cd backend
   # Create .env file with your database credentials
   # Copy from env.example and update values
   npm run setup
   ```

2. **Environment Variables**
   Create `backend/.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=bizmanager
   JWT_SECRET=your-secret-key
   PORT=4000
   ```

3. **Test Backend Connection**
   ```bash
   cd backend
   npm run test-connection
   ```

## API Endpoints

- **Health Check**: `GET /api/ping`
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Stores**: `/api/stores`
- **Sales**: `/api/sales`
- **Employees**: `/api/employees`
- **Expenses**: `/api/expenses`
- **Inventory**: `/api/inventory`
- **Payroll**: `/api/payroll`

## Development Scripts

- `npm run dev` - Start frontend only
- `npm run start:backend` - Start backend only
- `npm run start:full` - Start both frontend and backend
- `npm run setup` - Setup database and dependencies
- `npm run build` - Build for production

## Production Deployment

The application is configured to work with Render.com:
- Frontend: https://bitzmanager.onrender.com
- Backend: https://bitzmanager-py8.onrender.com

The API service automatically detects the environment and uses the correct endpoints.
