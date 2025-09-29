const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./middleware-auth'); // Matches your existing filename

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name || '', email, hash]);
    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: userId, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, photo_url, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
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