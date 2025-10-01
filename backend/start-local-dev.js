// Local development server that works without database
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
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

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'Backend is running' }));

// Mock auth endpoints for local development
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registration request:', { name, email, password: password ? '***' : 'missing' });
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  // Mock successful registration
  const mockToken = 'mock-jwt-token-' + Date.now();
  const mockUser = { id: 1, name: name || 'User', email };
  
  res.json({ 
    token: mockToken, 
    user: mockUser,
    message: 'Registration successful (mock)'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password: password ? '***' : 'missing' });
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  // Mock successful login
  const mockToken = 'mock-jwt-token-' + Date.now();
  const mockUser = { id: 1, name: 'User', email };
  
  res.json({ 
    token: mockToken, 
    user: mockUser,
    message: 'Login successful (mock)'
  });
});

// Mock other endpoints
app.get('/api/stores', (req, res) => res.json([]));
app.get('/api/sales', (req, res) => res.json([]));
app.get('/api/employees', (req, res) => res.json([]));
app.get('/api/expenses', (req, res) => res.json([]));
app.get('/api/inventory', (req, res) => res.json([]));
app.get('/api/payroll', (req, res) => res.json([]));

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Local Development Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/ping`);
  console.log(`📝 This is a mock server for local development`);
});
