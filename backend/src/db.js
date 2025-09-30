const mysql = require('mysql2/promise');

// Railway MySQL connection configuration
const connectionConfig = {
  host: process.env.MYSQLHOST || 'shortline.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'BOjfVvOWJNiGwdyNqMkfuZrAKxrCXAwb',
  database: process.env.MYSQLDATABASE || 'bizmanager',
  port: process.env.MYSQLPORT || 46175,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

const pool = mysql.createPool(connectionConfig);

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Connection config:', {
      host: connectionConfig.host,
      port: connectionConfig.port,
      database: connectionConfig.database,
      user: connectionConfig.user
    });
  });

module.exports = pool;