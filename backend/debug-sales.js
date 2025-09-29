require('dotenv').config();
const db = require('./src/db');

async function debugSales() {
  try {
    console.log('🔍 Debugging Sales Creation...\n');
    
    // Test the exact query that's failing
    const testData = {
      customer: 'Test Customer',
      phone: '1234567890',
      location: 'Test Location',
      store: '1', // This should be a valid store ID
      amount: 100.00,
      items: 1,
      paymentMethod: 'Cash',
      advance: 0,
      status: 'Pending Payment'
    };
    
    console.log('Test data:', testData);
    
    // Check if store exists
    const [stores] = await db.query('SELECT * FROM stores WHERE id = ?', [testData.store]);
    console.log('Store found:', stores);
    
    if (stores.length === 0) {
      console.log('❌ Store with ID 1 does not exist. Creating a test store...');
      await db.query('INSERT INTO stores (name, address, phone, gstin) VALUES (?, ?, ?, ?)', 
        ['Test Store', 'Test Address', '123-456-7890', 'GST123456789']);
      console.log('✅ Test store created');
    }
    
    // Test the sales insert
    const billId = `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const balance = testData.amount - testData.advance;
    
    console.log('Attempting to insert sale...');
    const [result] = await db.query(
      'INSERT INTO sales (customer, phone, location, store_id, total, items, payment_method, advance, balance, status, bill_id, sale_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [testData.customer, testData.phone, testData.location, testData.store, testData.amount, testData.items, testData.paymentMethod, testData.advance, balance, testData.status, billId, new Date().toISOString().split('T')[0]]
    );
    
    console.log('✅ Sale inserted successfully with ID:', result.insertId);
    
    // Get the inserted sale
    const [newSale] = await db.query('SELECT * FROM sales WHERE id = ?', [result.insertId]);
    console.log('✅ Retrieved sale:', newSale[0]);
    
    // Clean up test data
    await db.query('DELETE FROM sales WHERE id = ?', [result.insertId]);
    console.log('✅ Test sale cleaned up');
    
    console.log('\n🎉 Sales creation is working correctly!');
    
  } catch (error) {
    console.error('❌ Error debugging sales:', error.message);
    console.error('Full error:', error);
  }
  
  process.exit(0);
}

debugSales();
