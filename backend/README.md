# BizManager Backend

Express.js backend with MySQL database for BizManager application.

## Features

- User authentication (signup/login)
- JWT token-based authentication
- Password hashing with bcrypt
- MySQL database integration
- RESTful API endpoints
- CORS enabled for frontend

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

3. **Check database connection:**
   ```bash
   npm run check
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=bizmanager
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Stores
- `GET /api/stores` - List all stores
- `POST /api/stores` - Create store (protected)
- `GET /api/stores/:id` - Get store by ID
- `PUT /api/stores/:id` - Update store (protected)
- `DELETE /api/stores/:id` - Delete store (protected)

### Sales
- `GET /api/sales` - List all sales (protected)
- `POST /api/sales` - Create sale (protected)

### Employees
- `GET /api/employees` - List all employees (protected)
- `POST /api/employees` - Create employee (protected)
- `GET /api/employees/:id` - Get employee by ID (protected)
- `PUT /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (protected)

### Expenses
- `GET /api/expenses` - List all expenses (protected)
- `POST /api/expenses` - Create expense (protected)
- `GET /api/expenses/:id` - Get expense by ID (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)

### Inventory
- `GET /api/inventory` - List all products (protected)
- `POST /api/inventory` - Create product (protected)
- `GET /api/inventory/:id` - Get product by ID (protected)
- `PUT /api/inventory/:id` - Update product (protected)
- `DELETE /api/inventory/:id` - Delete product (protected)

### Payroll
- `GET /api/payroll` - List all payroll records (protected)
- `POST /api/payroll` - Create payroll record (protected)
- `GET /api/payroll/:id` - Get payroll record by ID (protected)
- `PUT /api/payroll/:id` - Update payroll record (protected)
- `DELETE /api/payroll/:id` - Delete payroll record (protected)

## Development

- `npm run dev` - Start development server with nodemon
- `npm run check` - Test database connection
- `npm start` - Start production server

## Data Storage

All data created through the frontend will be automatically stored in your MySQL Workbench database. The backend connects to your existing database and handles all CRUD operations.

## Troubleshooting

1. **Database connection failed:**
   - Ensure MySQL is running
   - Check your `.env` credentials
   - Verify database exists in MySQL Workbench

2. **Port already in use:**
   - Change PORT in `.env` file
   - Kill existing processes on port 4000

3. **JWT errors:**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration settings