const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./middleware-auth'); // Matches your existing filename

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registration request:', { name, email, password: password ? '***' : 'missing' });
  
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    // Check if user already exists
    console.log('Checking if user already exists for email:', email);
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    console.log('Existing users found:', existingUsers.length);
    
    if (existingUsers.length > 0) {
      console.log('User already exists, returning error');
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    
    // Insert user into database
    console.log('Inserting user into database...');
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name || 'User', email, hashedPassword]
    );
    
    const userId = result.insertId;
    console.log('User registered successfully with ID:', userId);
    console.log('Insert result:', result);
    
    // Verify user was actually inserted
    console.log('Verifying user was inserted...');
    const [verifyUser] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    console.log('Verification result:', verifyUser.length > 0 ? 'User found' : 'User not found');
    
    if (verifyUser.length === 0) {
      console.error('User was not inserted into database despite successful query');
      return res.status(500).json({ error: 'Failed to create user in database' });
    }
    
    // Generate JWT token
    console.log('Generating JWT token...');
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-bizmanager-2024', { expiresIn: '7d' });
    console.log('JWT token generated successfully');
    
    return res.json({ 
      token, 
      user: { id: userId, name: name || 'User', email },
      message: 'Registration successful'
    });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    // Find user in database
    const [users] = await db.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Login successful for:', email);
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-bizmanager-2024', { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Profile request for user ID:', req.user.id);
    console.log('User from token:', req.user);
    
    const [rows] = await db.query('SELECT id, name, email, photo_url, created_at FROM users WHERE id = ?', [req.user.id]);
    console.log('Profile query result:', rows.length > 0 ? 'User found' : 'User not found');
    
    if (!rows.length) {
      console.log('User not found in database for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Profile data:', rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Profile error:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const { name, photo_url } = req.body;
  
  console.log('Profile update request - name:', name, 'photo_url length:', photo_url ? photo_url.length : 0);
  
  try {
    await db.query(
      'UPDATE users SET name = ?, photo_url = ? WHERE id = ?',
      [name, photo_url, req.user.id]
    );
    
    const [updatedUser] = await db.query('SELECT id, name, email, photo_url, created_at FROM users WHERE id = ?', [req.user.id]);
    console.log('Profile updated successfully for user:', req.user.id);
    res.json(updatedUser[0]);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing current or new password' });
  }

  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(currentPassword, rows[0].password);
    if (!validPassword) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;