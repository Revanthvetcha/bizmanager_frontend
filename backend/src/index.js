require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db'); 
const authRoutes = require('./routes-auth'); 
const storeRoutes = require('./routes-stores');
const salesRoutes = require('./routes-sales');
const employeeRoutes = require('./routes-employees');
const expenseRoutes = require('./routes-expenses');
const inventoryRoutes = require('./routes-inventory');
const payrollRoutes = require('./routes-payroll');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:5180',
    'https://bitzmanager.onrender.com',
    'https://bitzmanager-py8.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check (for testing & Render)
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'Backend is running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payroll', payrollRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API listening on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/ping`);
});

// Error handling for uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});