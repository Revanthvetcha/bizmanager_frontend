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

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
      'https://bitzmanager.onrender.com',
      'https://bitzmanager-py8p.onrender.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests - CORS middleware already handles this

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Health check (for testing & Render)
app.get('/api/ping', (req, res) => res.json({ 
  ok: true, 
  message: 'Backend is running',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// Root route for better debugging
app.get('/', (req, res) => {
  res.json({
    message: 'BitzManager Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/ping',
      auth: '/api/auth/*',
      stores: '/api/stores/*',
      sales: '/api/sales/*',
      employees: '/api/employees/*',
      expenses: '/api/expenses/*',
      inventory: '/api/inventory/*',
      payroll: '/api/payroll/*'
    }
  });
});

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