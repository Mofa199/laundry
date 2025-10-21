import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Default to in-memory data if database connection fails
let useDatabase = true;
let pool = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'laundry_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds timeout
};

try {
  pool = mysql.createPool(dbConfig);
  
  // Test the connection
  pool.getConnection()
    .then(connection => {
      console.log('Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.error('Database connection error:', err);
      console.log('Falling back to in-memory data storage');
      useDatabase = false;
    });
} catch (error) {
  console.error('Database pool creation error:', error);
  console.log('Falling back to in-memory data storage');
  useDatabase = false;
}

// Export a mock pool if database is not available
if (!useDatabase) {
  pool = {
    execute: async (query, params) => {
      console.log('Database query (mocked):', query, params);
      // Return mock data based on the query
      if (query.includes('SELECT * FROM orders')) {
        return [[]]; // Empty orders array
      }
      if (query.includes('SELECT * FROM invoices')) {
        return [[]]; // Empty invoices array
      }
      return [[]]; // Default empty result
    }
  };
}

export default pool;