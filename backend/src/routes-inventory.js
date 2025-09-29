const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      LEFT JOIN stores s ON p.store_id = s.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new product
router.post('/', auth, async (req, res) => {
  const { name, code, category, price, stock, description, store_id } = req.body;
  
  if (!name || !code || !category || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if product code already exists
    const [existing] = await db.query('SELECT id FROM products WHERE code = ?', [code]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Product with this code already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, code, category, price, stock, description, store_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, code, category, price, stock || 0, description || '', store_id]
    );

    const [newProduct] = await db.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json(newProduct[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  const { name, code, category, price, stock, description, store_id } = req.body;
  
  try {
    // Check if product exists
    const [existing] = await db.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if code is being changed and if it already exists
    if (code) {
      const [codeCheck] = await db.query('SELECT id FROM products WHERE code = ? AND id != ?', [code, req.params.id]);
      if (codeCheck.length > 0) {
        return res.status(400).json({ error: 'Product with this code already exists' });
      }
    }

    await db.query(
      'UPDATE products SET name = ?, code = ?, category = ?, price = ?, stock = ?, description = ?, store_id = ? WHERE id = ?',
      [name, code, category, price, stock, description, store_id, req.params.id]
    );

    const [updatedProduct] = await db.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);

    res.json(updatedProduct[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update stock
router.patch('/:id/stock', auth, async (req, res) => {
  const { stock } = req.body;
  
  if (stock === undefined || stock < 0) {
    return res.status(400).json({ error: 'Invalid stock value' });
  }

  try {
    const [result] = await db.query('UPDATE products SET stock = ? WHERE id = ?', [stock, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const [updatedProduct] = await db.query(`
      SELECT p.*, s.name as store_name 
      FROM products p 
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);

    res.json(updatedProduct[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get inventory statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [totalProducts] = await db.query('SELECT COUNT(*) as total FROM products');
    const [lowStock] = await db.query('SELECT COUNT(*) as total FROM products WHERE stock < 10');
    const [categoryStats] = await db.query(`
      SELECT category, COUNT(*) as count, SUM(stock) as total_stock, AVG(price) as avg_price 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `);
    const [totalValue] = await db.query('SELECT SUM(price * stock) as total FROM products');

    res.json({
      totalProducts: totalProducts[0].total,
      lowStock: lowStock[0].total,
      categoryStats,
      totalValue: totalValue[0].total || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
