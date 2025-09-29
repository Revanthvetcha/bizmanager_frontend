const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// list stores (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// create store (protected)
router.post('/', auth, async (req, res) => {
  const { name, address, phone, gstin } = req.body;
  
  if (!name || !address || !phone || !gstin) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query('INSERT INTO stores (name, address, phone, gstin) VALUES (?, ?, ?, ?)', [name, address, phone, gstin]);
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get store by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// update store (protected)
router.put('/:id', auth, async (req, res) => {
  const { name, address, phone, gstin } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE stores SET name = ?, address = ?, phone = ?, gstin = ? WHERE id = ?',
      [name, address, phone, gstin, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const [updatedStore] = await db.query('SELECT * FROM stores WHERE id = ?', [req.params.id]);
    res.json(updatedStore[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// delete store (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM stores WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
