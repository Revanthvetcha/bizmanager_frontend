const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing Railway MySQL Connection...\n');

  const connectionConfig = {
    host: 'shortline.proxy.rlwy.net',
    user: 'root',
    password: 'BOjfVvOWJNiGwdyNqMkfuZrAKxrCXAwb',
    database: 'bizmanager',
    port: 46175,
    acquireTimeout: 60000,
    timeout: 60000
  };

  console.log('Connection details:');
  console.log(`Host: ${connectionConfig.host}`);
  console.log(`Port: ${connectionConfig.port}`);
  console.log(`Database: ${connectionConfig.database}`);
  console.log(`User: ${connectionConfig.user}`);
  console.log('');

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connection established successfully!');

    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Basic query test passed');

    // Check database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db');
    console.log(`📊 Connected to database: ${dbInfo[0].current_db}`);

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));

    // Check users table specifically
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`👥 Users in database: ${users[0].count}`);
    } catch (err) {
      console.log('⚠️  Users table does not exist yet');
    }

    await connection.end();
    console.log('\n🎉 Connection test successful!');
    console.log('📡 Your Railway MySQL database is accessible');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run setup');
    console.log('2. Run: npm run dev');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('Error sqlState:', error.sqlState);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Railway service is running');
    console.log('2. Verify the connection details are correct');
    console.log('3. Make sure the database exists in Railway');
    console.log('4. Check your Railway dashboard for any service issues');
    
    process.exit(1);
  }
}

testConnection();
