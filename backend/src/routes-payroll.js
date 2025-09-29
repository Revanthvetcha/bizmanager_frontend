const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// Get all payroll records
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, e.name as employee_name, e.position, s.name as store_name 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.id 
      LEFT JOIN stores s ON e.store_id = s.id
      ORDER BY p.year DESC, p.month DESC, p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payroll by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, e.name as employee_name, e.position, s.name as store_name 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.id 
      LEFT JOIN stores s ON e.store_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new payroll record
router.post('/', auth, async (req, res) => {
  const { employee_id, month, year, basic_salary, allowances, deductions, net_salary, status } = req.body;
  
  if (!employee_id || !month || !year || !basic_salary || !net_salary) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if payroll record already exists for this employee, month, and year
    const [existing] = await db.query(
      'SELECT id FROM payroll WHERE employee_id = ? AND month = ? AND year = ?',
      [employee_id, month, year]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Payroll record already exists for this employee, month, and year' });
    }

    const [result] = await db.query(
      'INSERT INTO payroll (employee_id, month, year, basic_salary, allowances, deductions, net_salary, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employee_id, month, year, basic_salary, allowances || 0, deductions || 0, net_salary, status || 'pending']
    );

    const [newPayroll] = await db.query(`
      SELECT p.*, e.name as employee_name, e.position, s.name as store_name 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.id 
      LEFT JOIN stores s ON e.store_id = s.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json(newPayroll[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update payroll record
router.put('/:id', auth, async (req, res) => {
  const { basic_salary, allowances, deductions, net_salary, status, payment_date } = req.body;
  
  try {
    // Check if payroll record exists
    const [existing] = await db.query('SELECT id FROM payroll WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }

    await db.query(
      'UPDATE payroll SET basic_salary = ?, allowances = ?, deductions = ?, net_salary = ?, status = ?, payment_date = ? WHERE id = ?',
      [basic_salary, allowances, deductions, net_salary, status, payment_date, req.params.id]
    );

    const [updatedPayroll] = await db.query(`
      SELECT p.*, e.name as employee_name, e.position, s.name as store_name 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.id 
      LEFT JOIN stores s ON e.store_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);

    res.json(updatedPayroll[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete payroll record
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM payroll WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }
    
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payroll statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [totalPayroll] = await db.query('SELECT SUM(net_salary) as total FROM payroll WHERE status = "paid"');
    const [monthlyPayroll] = await db.query(`
      SELECT SUM(net_salary) as total 
      FROM payroll 
      WHERE status = "paid" 
      AND month = MONTH(CURRENT_DATE()) 
      AND year = YEAR(CURRENT_DATE())
    `);
    const [pendingPayroll] = await db.query('SELECT COUNT(*) as count, SUM(net_salary) as total FROM payroll WHERE status = "pending"');
    const [paidPayroll] = await db.query('SELECT COUNT(*) as count, SUM(net_salary) as total FROM payroll WHERE status = "paid"');

    res.json({
      totalPayroll: totalPayroll[0].total || 0,
      monthlyPayroll: monthlyPayroll[0].total || 0,
      pendingPayroll: pendingPayroll[0],
      paidPayroll: paidPayroll[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get payroll by employee
router.get('/employee/:employeeId', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, e.name as employee_name, e.position, s.name as store_name 
      FROM payroll p 
      JOIN employees e ON p.employee_id = e.id 
      LEFT JOIN stores s ON e.store_id = s.id
      WHERE p.employee_id = ?
      ORDER BY p.year DESC, p.month DESC
    `, [req.params.employeeId]);
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
