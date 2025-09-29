require('dotenv').config();
const db = require('./src/db');

async function startServer() {
  console.log('🚀 Starting BizManager Backend...\n');

  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    // Check if database exists and has tables
    const [tables] = await db.query('SHOW TABLES');
    console.log('📊 Found tables:', tables.map(t => Object.values(t)[0]));

    // Check if we have data
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [stores] = await db.query('SELECT COUNT(*) as count FROM stores');
    
    console.log(`👥 Users: ${users[0].count}`);
    console.log(`🏪 Stores: ${stores[0].count}`);

    console.log('\n🎉 Backend is ready!');
    console.log('📡 API will be available at: http://localhost:4000');
    console.log('🔗 Frontend should connect to: http://localhost:5173');
    console.log('💾 All data will be stored in your MySQL Workbench database');
    
    // Start the actual server
    require('./src/index.js');

  } catch (error) {
    console.error('❌ Failed to start backend:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file credentials');
    console.log('3. Verify your database exists in MySQL Workbench');
    console.log('4. Run: npm run check');
    process.exit(1);
  }
}

startServer();
