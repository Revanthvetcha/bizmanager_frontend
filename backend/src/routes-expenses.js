const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// Get all expenses
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as created_by_name, e.title as name
      FROM expenses e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.expense_date DESC, e.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expense by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as created_by_name, e.title as name
      FROM expenses e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new expense
router.post('/', auth, async (req, res) => {
  const { name, amount, category, store_id, expense_date, receipt_url, notes } = req.body;
  
  if (!name || !amount || !category || !expense_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO expenses (title, amount, category, store_id, expense_date, receipt_url, notes, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, amount, category, store_id, expense_date, receipt_url || '', notes || '', req.user.id]
    );

    const [newExpense] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as created_by_name, e.title as name
      FROM expenses e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `, [result.insertId]);

    res.status(201).json(newExpense[0]);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  const { name, amount, category, store_id, expense_date, receipt_url, notes } = req.body;
  
  try {
    // Check if expense exists
    const [existing] = await db.query('SELECT id FROM expenses WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.query(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, store_id = ?, expense_date = ?, receipt_url = ?, notes = ? WHERE id = ?',
      [name, amount, category, store_id, expense_date, receipt_url, notes, req.params.id]
    );

    const [updatedExpense] = await db.query(`
      SELECT e.*, s.name as store_name, u.name as created_by_name, e.title as name
      FROM expenses e 
      LEFT JOIN stores s ON e.store_id = s.id 
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = ?
    `, [req.params.id]);

    res.json(updatedExpense[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expense statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [totalExpenses] = await db.query('SELECT SUM(amount) as total FROM expenses');
    const [monthlyExpenses] = await db.query(`
      SELECT SUM(amount) as total 
      FROM expenses 
      WHERE MONTH(expense_date) = MONTH(CURRENT_DATE()) 
      AND YEAR(expense_date) = YEAR(CURRENT_DATE())
    `);
    const [categoryStats] = await db.query(`
      SELECT category, SUM(amount) as total, COUNT(*) as count 
      FROM expenses 
      GROUP BY category 
      ORDER BY total DESC
    `);

    res.json({
      totalExpenses: totalExpenses[0].total || 0,
      monthlyExpenses: monthlyExpenses[0].total || 0,
      categoryStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
