require('dotenv').config();
const db = require('./src/db');

async function setupDatabase() {
  console.log('🔧 Setting up Database Tables...\n');

  try {
    // Test basic connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    console.log('📋 Creating tables if they don\'t exist...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create stores table
    await db.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location TEXT,
        phone VARCHAR(20),
        manager VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Stores table created/verified');

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        quantity INT NOT NULL DEFAULT 0,
        store_id INT,
        code VARCHAR(100) UNIQUE,
        category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Products table created/verified');

    // Create employees table
    await db.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        position VARCHAR(100),
        salary DECIMAL(10,2) DEFAULT 0,
        hire_date DATE,
        status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
        store_id INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Employees table created/verified');

    // Create sales table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer VARCHAR(255),
        phone VARCHAR(20),
        location TEXT,
        items INT DEFAULT 0,
        total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        payment_method VARCHAR(50) DEFAULT 'Cash',
        advance DECIMAL(10,2) DEFAULT 0,
        balance DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Pending Payment',
        bill_id VARCHAR(100) UNIQUE,
        sale_date DATE,
        store_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Sales table created/verified');

    // Create expenses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        store_id INT,
        expense_date DATE,
        receipt_url TEXT,
        notes TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Expenses table created/verified');

    // Create payroll table
    await db.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        pay_period_start DATE,
        pay_period_end DATE,
        status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
        payment_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Payroll table created/verified');

    // Check if we have any data
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [stores] = await db.query('SELECT COUNT(*) as count FROM stores');
    const [sales] = await db.query('SELECT COUNT(*) as count FROM sales');
    
    console.log(`\n📊 Current data:`);
    console.log(`👥 Users: ${users[0].count}`);
    console.log(`🏪 Stores: ${stores[0].count}`);
    console.log(`💰 Sales: ${sales[0].count}`);

    console.log('\n🎉 Database setup completed!');
    console.log('📡 Your backend should now work properly with authentication');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Test registration and login');
    console.log('3. All data will be stored in your MySQL database');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials');
    console.log('3. Verify the database exists in MySQL Workbench');
    process.exit(1);
  }

  process.exit(0);
}

setupDatabase();
