require('dotenv').config();
const db = require('./src/db');

async function fixDatabase() {
  console.log('🔧 Fixing Database Schema...\n');

  try {
    // Test basic connection
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');

    console.log('📋 Checking and fixing table schemas...');

    // Check and fix sales table
    try {
      await db.query('ALTER TABLE sales ADD COLUMN customer VARCHAR(255)');
      console.log('✅ Added customer column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ customer column already exists in sales table');
      } else {
        console.log('❌ Error adding customer column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN phone VARCHAR(20)');
      console.log('✅ Added phone column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ phone column already exists in sales table');
      } else {
        console.log('❌ Error adding phone column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN location TEXT');
      console.log('✅ Added location column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ location column already exists in sales table');
      } else {
        console.log('❌ Error adding location column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN items INT');
      console.log('✅ Added items column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ items column already exists in sales table');
      } else {
        console.log('❌ Error adding items column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN payment_method VARCHAR(50) DEFAULT "Cash"');
      console.log('✅ Added payment_method column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ payment_method column already exists in sales table');
      } else {
        console.log('❌ Error adding payment_method column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN advance DECIMAL(10,2) DEFAULT 0');
      console.log('✅ Added advance column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ advance column already exists in sales table');
      } else {
        console.log('❌ Error adding advance column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN balance DECIMAL(10,2) DEFAULT 0');
      console.log('✅ Added balance column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ balance column already exists in sales table');
      } else {
        console.log('❌ Error adding balance column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN status VARCHAR(50) DEFAULT "Pending Payment"');
      console.log('✅ Added status column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ status column already exists in sales table');
      } else {
        console.log('❌ Error adding status column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN bill_id VARCHAR(100) UNIQUE');
      console.log('✅ Added bill_id column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ bill_id column already exists in sales table');
      } else {
        console.log('❌ Error adding bill_id column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE sales ADD COLUMN sale_date DATE');
      console.log('✅ Added sale_date column to sales table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ sale_date column already exists in sales table');
      } else {
        console.log('❌ Error adding sale_date column:', error.message);
      }
    }

    // Check and fix employees table
    try {
      await db.query('ALTER TABLE employees ADD COLUMN position VARCHAR(100)');
      console.log('✅ Added position column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ position column already exists in employees table');
      } else {
        console.log('❌ Error adding position column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE employees ADD COLUMN salary DECIMAL(10,2) DEFAULT 0');
      console.log('✅ Added salary column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ salary column already exists in employees table');
      } else {
        console.log('❌ Error adding salary column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE employees ADD COLUMN hire_date DATE');
      console.log('✅ Added hire_date column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ hire_date column already exists in employees table');
      } else {
        console.log('❌ Error adding hire_date column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE employees ADD COLUMN status ENUM("active", "inactive", "terminated") DEFAULT "active"');
      console.log('✅ Added status column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ status column already exists in employees table');
      } else {
        console.log('❌ Error adding status column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE employees ADD COLUMN store_id INT');
      console.log('✅ Added store_id column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ store_id column already exists in employees table');
      } else {
        console.log('❌ Error adding store_id column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE employees ADD COLUMN user_id INT');
      console.log('✅ Added user_id column to employees table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ user_id column already exists in employees table');
      } else {
        console.log('❌ Error adding user_id column:', error.message);
      }
    }

    // Check and fix expenses table
    try {
      await db.query('ALTER TABLE expenses ADD COLUMN store_id INT');
      console.log('✅ Added store_id column to expenses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ store_id column already exists in expenses table');
      } else {
        console.log('❌ Error adding store_id column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE expenses ADD COLUMN expense_date DATE');
      console.log('✅ Added expense_date column to expenses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ expense_date column already exists in expenses table');
      } else {
        console.log('❌ Error adding expense_date column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE expenses ADD COLUMN receipt_url TEXT');
      console.log('✅ Added receipt_url column to expenses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ receipt_url column already exists in expenses table');
      } else {
        console.log('❌ Error adding receipt_url column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE expenses ADD COLUMN notes TEXT');
      console.log('✅ Added notes column to expenses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ notes column already exists in expenses table');
      } else {
        console.log('❌ Error adding notes column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE expenses ADD COLUMN created_by INT');
      console.log('✅ Added created_by column to expenses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ created_by column already exists in expenses table');
      } else {
        console.log('❌ Error adding created_by column:', error.message);
      }
    }

    // Check and fix products table
    try {
      await db.query('ALTER TABLE products ADD COLUMN store_id INT');
      console.log('✅ Added store_id column to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ store_id column already exists in products table');
      } else {
        console.log('❌ Error adding store_id column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE products ADD COLUMN code VARCHAR(100) UNIQUE');
      console.log('✅ Added code column to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ code column already exists in products table');
      } else {
        console.log('❌ Error adding code column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE products ADD COLUMN category VARCHAR(100)');
      console.log('✅ Added category column to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ category column already exists in products table');
      } else {
        console.log('❌ Error adding category column:', error.message);
      }
    }

    try {
      await db.query('ALTER TABLE products ADD COLUMN description TEXT');
      console.log('✅ Added description column to products table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ description column already exists in products table');
      } else {
        console.log('❌ Error adding description column:', error.message);
      }
    }

    // Check and fix users table
    try {
      await db.query('ALTER TABLE users ADD COLUMN photo_url TEXT');
      console.log('✅ Added photo_url column to users table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ photo_url column already exists in users table');
      } else {
        console.log('❌ Error adding photo_url column:', error.message);
      }
    }

    console.log('\n🎉 Database schema fix completed!');
    console.log('📊 All required columns should now exist');
    console.log('📡 Your backend should now work properly with the database');

  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file credentials');
    console.log('3. Verify the database exists in MySQL Workbench');
    process.exit(1);
  }

  process.exit(0);
}

fixDatabase();
