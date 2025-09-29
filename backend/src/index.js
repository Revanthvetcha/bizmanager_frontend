// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// const db = require('./db'); // connection pool
// const authRoutes = require('./routes-auth');
// const storeRoutes = require('./routes-stores');
// const salesRoutes = require('./routes-sales');
// const employeeRoutes = require('./routes-employees');
// const expenseRoutes = require('./routes-expenses');
// const inventoryRoutes = require('./routes-inventory');
// const payrollRoutes = require('./routes-payroll');

// const app = express();

// // ✅ CORS: allow frontend (set FRONTEND_URL in Render)
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));

// // ✅ Middleware
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // ✅ Health check (for testing & Render)
// app.get('/api/ping', (req, res) => res.json({ ok: true }));

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/stores', storeRoutes);
// app.use('/api/sales', salesRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/payroll', payrollRoutes);

// // ✅ Fallback for unknown routes
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });

// // ✅ Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`✅ Backend API listening on port ${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db'); 
const authRoutes = require('./routes-auth'); 
const storeRoutes = require('./routes/stores');
const salesRoutes = require('./routes/sales');
const employeeRoutes = require('./routes-employees');
const expenseRoutes = require('./routes-expenses');
const inventoryRoutes = require('./routes-inventory');
const payrollRoutes = require('./routes-payroll');

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Health check (for testing & Render)
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payroll', payrollRoutes);

// ✅ Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API listening on port ${PORT}`);
});

// ✅ Error handling for uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});