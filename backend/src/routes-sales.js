const express = require('express');
const db = require('./db');
const auth = require('./middleware-auth');

const router = express.Router();

// create sale (protected)
router.post('/', auth, async (req, res) => {
  const { 
    customer, 
    phone, 
    location, 
    store, 
    amount, 
    items, 
    paymentMethod, 
    advance, 
    status 
  } = req.body;
  
  // Map amount to total for database
  const total = amount;
  
  if (!customer || !store || !amount || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate unique bill ID
    const billId = `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const balance = amount - (advance || 0);
    
    // Convert store name to store_id if needed
    let storeId = store;
    if (typeof store === 'string') {
      const [storeRows] = await db.query('SELECT id FROM stores WHERE name = ?', [store]);
      if (storeRows.length === 0) {
        return res.status(400).json({ error: 'Store not found' });
      }
      storeId = storeRows[0].id;
    }
    
    // Convert items to JSON if it's a number
    const itemsJson = typeof items === 'number' ? JSON.stringify([{name: 'Item', quantity: items, price: total/items}]) : JSON.stringify(items);
    
    const [result] = await db.query(
      'INSERT INTO sales (customer, customer_name, phone, location, store_id, total, items, payment_method, advance, balance, status, bill_id, sale_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customer, customer, phone || '', location || '', storeId, total, itemsJson, paymentMethod || 'Cash', advance || 0, balance, status || 'Pending Payment', billId, new Date().toISOString().split('T')[0]]
    );
    
    const [newSale] = await db.query('SELECT * FROM sales WHERE id = ?', [result.insertId]);
    res.status(201).json(newSale[0]);
  } catch (err) {
    console.error('Sales creation error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// list sales (protected)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.*,
        st.name as store_name,
        s.customer as customer,
        s.total as amount,
        s.sale_date as date,
        s.bill_id as billId
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
