require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db'); // connection pool
const authRoutes = require('./routes-auth');
const storeRoutes = require('./routes-stores');
const salesRoutes = require('./routes-sales');
const employeeRoutes = require('./routes-employees');
const expenseRoutes = require('./routes-expenses');
const inventoryRoutes = require('./routes-inventory');
const payrollRoutes = require('./routes-payroll');

const app = express();

// allow frontend origins (Vite default 5173, but can also run on 5174, 5175, 5176, 5177, 5178)
app.use(cors({ 
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payroll', payrollRoutes);

// start
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
