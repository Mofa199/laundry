import pool from './db.js';

const createTables = async () => {
  try {
    // Create orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_location VARCHAR(100) NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        order_type VARCHAR(20) NOT NULL,
        quick_order INT DEFAULT 0,
        tshirts INT DEFAULT 0,
        dresses INT DEFAULT 0,
        jeans INT DEFAULT 0,
        curtains INT DEFAULT 0,
        baskets INT DEFAULT 0,
        pickup_day VARCHAR(20) NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        total_amount DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(20) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        items JSON,
        total_amount DECIMAL(10, 2) NOT NULL,
        sent_via_whatsapp BOOLEAN DEFAULT FALSE,
        sent_via_email BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
      )
    `);

    // Add columns to invoices table if they don't exist (for backward compatibility)
    try {
      await pool.execute(`ALTER TABLE invoices ADD COLUMN sent_via_whatsapp BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Column might already exist, ignore error
    }
    
    try {
      await pool.execute(`ALTER TABLE invoices ADD COLUMN sent_via_email BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Column might already exist, ignore error
    }

    // Create financial_reports table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS financial_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_type ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        total_orders INT DEFAULT 0,
        total_revenue DECIMAL(12, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating database tables:', error);
  }
};

createTables();