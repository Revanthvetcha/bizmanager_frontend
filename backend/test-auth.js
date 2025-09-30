require('dotenv').config();
const db = require('./src/db');

async function testAuth() {
  console.log('🧪 Testing Authentication Setup...\n');

  try {
    // Test database connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    // Check if users table exists and has proper structure
    const [tables] = await db.query('SHOW TABLES LIKE "users"');
    if (tables.length === 0) {
      console.log('❌ Users table does not exist');
      console.log('🔧 Run: npm run setup');
      return;
    }
    console.log('✅ Users table exists');

    // Check users table structure
    const [columns] = await db.query('DESCRIBE users');
    const columnNames = columns.map(col => col.Field);
    const requiredColumns = ['id', 'name', 'email', 'password', 'created_at'];
    
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns in users table:', missingColumns);
      console.log('🔧 Run: npm run setup');
      return;
    }
    console.log('✅ Users table has required columns');

    // Test user creation
    console.log('\n🧪 Testing user registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    try {
      // Hash password
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash(testPassword, 10);
      
      // Insert test user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Test User', testEmail, hash]
      );
      
      console.log('✅ Test user created with ID:', result.insertId);
      
      // Test user login
      console.log('\n🧪 Testing user login...');
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [testEmail]);
      
      if (users.length === 0) {
        console.log('❌ Test user not found');
        return;
      }
      
      const user = users[0];
      const passwordMatch = await bcrypt.compare(testPassword, user.password);
      
      if (passwordMatch) {
        console.log('✅ Password verification successful');
      } else {
        console.log('❌ Password verification failed');
        return;
      }
      
      // Clean up test user
      await db.query('DELETE FROM users WHERE id = ?', [result.insertId]);
      console.log('✅ Test user cleaned up');
      
    } catch (err) {
      console.error('❌ User creation test failed:', err.message);
      return;
    }

    // Check existing users
    const [existingUsers] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n📊 Current users in database: ${existingUsers[0].count}`);

    if (existingUsers[0].count > 0) {
      const [userList] = await db.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
      console.log('\n👥 Recent users:');
      userList.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.created_at}`);
      });
    }

    console.log('\n🎉 Authentication setup is working correctly!');
    console.log('📡 You can now:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Test registration and login in your frontend');
    console.log('3. All user data will be stored in MySQL');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials');
    console.log('3. Run: npm run setup');
    process.exit(1);
  }

  process.exit(0);
}

testAuth();
