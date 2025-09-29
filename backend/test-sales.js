require('dotenv').config();
const db = require('./src/db');

async function testSales() {
  try {
    console.log('🔍 Testing Sales Table Structure...\n');
    
    // Check table structure
    const [columns] = await db.query('DESCRIBE sales');
    console.log('Sales table columns:');
    console.table(columns);
    
    // Test inserting a sample sale
    console.log('\n🧪 Testing Sales Insert...');
    const testSale = {
      customer: 'Test Customer',
      phone: '1234567890',
      location: 'Test Location',
      store: '1',
      amount: 100.00,
      items: 1,
      paymentMethod: 'Cash',
      advance: 0,
      status: 'Pending Payment'
    };
    
    const billId = `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const balance = testSale.amount - testSale.advance;
    
    const [result] = await db.query(
      'INSERT INTO sales (customer, phone, location, store_id, total, items, payment_method, advance, balance, status, bill_id, sale_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [testSale.customer, testSale.phone, testSale.location, testSale.store, testSale.amount, testSale.items, testSale.paymentMethod, testSale.advance, balance, testSale.status, billId, new Date().toISOString().split('T')[0]]
    );
    
    console.log('✅ Test sale inserted successfully with ID:', result.insertId);
    
    // Get the inserted sale
    const [newSale] = await db.query('SELECT * FROM sales WHERE id = ?', [result.insertId]);
    console.log('✅ Retrieved sale:', newSale[0]);
    
    // Clean up test data
    await db.query('DELETE FROM sales WHERE id = ?', [result.insertId]);
    console.log('✅ Test sale cleaned up');
    
    console.log('\n🎉 Sales table is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing sales:', error.message);
    console.error('Full error:', error);
  }
  
  process.exit(0);
}

testSales();
