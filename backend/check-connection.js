require('dotenv').config();
const db = require('./src/db');

async function checkConnection() {
  console.log('🔍 Checking Database Connection...\n');

  try {
    // Test basic connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    // Check if we're connected to the right database
    const [dbInfo] = await db.query('SELECT DATABASE() as current_db');
    console.log(`📊 Connected to database: ${dbInfo[0].current_db}`);

    // Check if tables exist
    const [tables] = await db.query('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));

    // Check if we have any data
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [stores] = await db.query('SELECT COUNT(*) as count FROM stores');
    const [sales] = await db.query('SELECT COUNT(*) as count FROM sales');
    
    console.log(`👥 Users: ${users[0].count}`);
    console.log(`🏪 Stores: ${stores[0].count}`);
    console.log(`💰 Sales: ${sales[0].count}`);

    console.log('\n🎉 Database is ready for data storage!');
    console.log('📡 Your backend will now store all data in MySQL Workbench');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Start your frontend: npm run dev');
    console.log('3. Create data through the app - it will be stored in MySQL Workbench');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file credentials');
    console.log('3. Verify the database exists in MySQL Workbench');
    console.log('4. Ensure your database name matches in .env file');
    process.exit(1);
  }

  process.exit(0);
}

checkConnection();
