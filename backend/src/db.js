const mysql = require('mysql2/promise');

// Force Railway database connection
const connectionConfig = {
  host: 'shortline.proxy.rlwy.net',
  user: 'root',
  password: 'BOjfVvOWJNiGwdyNqMkfuZrAKxrCXAwb',
  database: 'bizmanager',
  port: 46175,
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