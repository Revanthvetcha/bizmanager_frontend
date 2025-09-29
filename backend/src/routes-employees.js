const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as user_name,
             e.role as department, e.basic_salary as salary, e.hire_date as joinDate
      FROM employees e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as user_name,
             e.role as department, e.basic_salary as salary, e.hire_date as joinDate
      FROM employees e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new employee
router.post('/', auth, async (req, res) => {
  const { name, email, phone, position, salary, hire_date, status, store_id, user_id } = req.body;
  
  if (!name || !email || !phone || !position || !hire_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM employees WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO employees (name, email, phone, position, basic_salary, hire_date, status, store_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, position, salary || 0, hire_date, status || 'active', store_id, user_id]
    );

    const [newEmployee] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as user_name,
             e.role as department, e.basic_salary as salary, e.hire_date as joinDate
      FROM employees e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `, [result.insertId]);

    res.status(201).json(newEmployee[0]);
  } catch (err) {
    console.error('Employee creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, position, salary, hire_date, status, store_id, user_id } = req.body;
  
  try {
    // Check if employee exists
    const [existing] = await db.query('SELECT id FROM employees WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if email is being changed and if it already exists
    if (email) {
      const [emailCheck] = await db.query('SELECT id FROM employees WHERE email = ? AND id != ?', [email, req.params.id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Employee with this email already exists' });
      }
    }

    await db.query(
      'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, salary = ?, hire_date = ?, status = ?, store_id = ?, user_id = ? WHERE id = ?',
      [name, email, phone, position, salary, hire_date, status, store_id, user_id, req.params.id]
    );

    const [updatedEmployee] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as user_name 
      FROM employees e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `, [req.params.id]);

    res.json(updatedEmployee[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
