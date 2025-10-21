import express from 'express';
import cors from 'cors';
import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'laundry_admin_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Add error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Create transporter for nodemailer with error handling
let transporter;
let emailEnabled = true;

try {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Test transporter
  transporter.verify((error, success) => {
    if (error) {
      console.log('Email transporter error:', error);
      console.log('Email functionality will be disabled');
      emailEnabled = false;
    } else {
      console.log('Email transporter is ready');
    }
  });
} catch (error) {
  console.log('Failed to create email transporter:', error);
  console.log('Email functionality will be disabled');
  emailEnabled = false;
  transporter = {
    sendMail: async (options) => {
      console.log('Email sending (mocked):', options);
      return Promise.resolve({ messageId: 'mock-id' });
    }
  };
}

// Helper function to calculate total amount
const calculateTotal = (orderType, quickOrder, detailedOrder) => {
  if (orderType === 'quick') {
    return quickOrder * 300;
  } else {
    const tshirtTotal = (detailedOrder.tshirt || 0) * 300;
    const dressTotal = (detailedOrder.dress || 0) * 300;
    const jeansTotal = (detailedOrder.jeans || 0) * 500;
    const curtainTotal = (detailedOrder.curtain || 0) * 1000;
    const basketTotal = (detailedOrder.basket || 0) * 9000;
    
    return tshirtTotal + dressTotal + jeansTotal + curtainTotal + basketTotal;
  }
};

// Middleware to authenticate admin requests
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple authentication (in a real app, this would check against a database)
    if (username === 'admin' && password === 'laundry123') {
      // Generate a JWT token
      const token = jwt.sign(
        { username: 'admin', role: 'administrator' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.status(200).json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Send email to info@cleaningmadeasy.com
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.INFO_EMAIL,
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    if (emailEnabled) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Email sending disabled. Would have sent:', mailOptions);
    }
    
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.post('/api/order', async (req, res) => {
  try {
    const { 
      fullName, 
      phone, 
      email, 
      location, 
      serviceType, 
      orderType, 
      quickOrder, 
      detailedOrder, 
      pickupDay, 
      timeSlot, 
      notes 
    } = req.body;
    
    // Generate order ID
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    
    // Calculate total amount
    const totalAmount = calculateTotal(orderType, quickOrder, detailedOrder);
    
    // Save order to database
    const [result] = await pool.execute(
      `INSERT INTO orders (
        order_id, customer_name, customer_phone, customer_email, customer_location,
        service_type, order_type, quick_order, tshirts, dresses, jeans, curtains, baskets,
        pickup_day, time_slot, notes, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, fullName, phone, email, location,
        serviceType, orderType, quickOrder || 0,
        detailedOrder.tshirt || 0,
        detailedOrder.dress || 0,
        detailedOrder.jeans || 0,
        detailedOrder.curtain || 0,
        detailedOrder.basket || 0,
        pickupDay, timeSlot, notes || '', totalAmount
      ]
    );
    
    // Send email to bookyourwash@cleaningmadeasy.com
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BOOKING_EMAIL,
      subject: `New Order from ${fullName}`,
      text: `New order details:

Order ID: ${orderId}
Full Name: ${fullName}
Phone: ${phone}
Email: ${email}
Location: ${location}
Service Type: ${serviceType}
Order Type: ${orderType}
Quick Order: ${quickOrder}
Detailed Order: ${JSON.stringify(detailedOrder)}
Pickup Day: ${pickupDay}
Time Slot: ${timeSlot}
Notes: ${notes}
Total Amount: ${totalAmount}`,
      html: `
        <h2>New Order</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Order Type:</strong> ${orderType}</p>
        <p><strong>Quick Order:</strong> ${quickOrder}</p>
        <p><strong>Detailed Order:</strong></p>
        <ul>
          <li>T-shirts: ${detailedOrder.tshirt || 0}</li>
          <li>Dresses: ${detailedOrder.dress || 0}</li>
          <li>Jeans: ${detailedOrder.jeans || 0}</li>
          <li>Curtains: ${detailedOrder.curtain || 0}</li>
          <li>Baskets: ${detailedOrder.basket || 0}</li>
        </ul>
        <p><strong>Pickup Day:</strong> ${pickupDay}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
      `
    };
    
    if (emailEnabled) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Email sending disabled. Would have sent:', mailOptions);
    }
    
    res.status(200).json({ message: 'Order submitted successfully', orderId });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: 'Error submitting order' });
  }
});

// Get all orders (protected)
app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get order by ID (protected)
app.get('/api/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Update order status (protected)
app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Get all invoices (protected)
app.get('/api/invoices', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM invoices ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
});

// Update invoice WhatsApp sent status (protected)
app.put('/api/invoices/:id/whatsapp', authenticateAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'UPDATE invoices SET sent_via_whatsapp = ? WHERE id = ?',
      [true, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(200).json({ message: 'Invoice WhatsApp status updated successfully' });
  } catch (error) {
    console.error('Error updating invoice WhatsApp status:', error);
    res.status(500).json({ message: 'Error updating invoice WhatsApp status' });
  }
});

// Generate and send invoice
app.post('/api/invoice', authenticateAdmin, async (req, res) => {
  try {
    const { 
      orderId,
      customer,
      phone,
      email,
      items,
      total
    } = req.body;
    
    // Save invoice to database
    const [result] = await pool.execute(
      'INSERT INTO invoices (order_id, customer_name, customer_phone, customer_email, items, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, customer, phone, email, JSON.stringify(items), total]
    );
    
    // Send email to registeredorder@cleaningmadeasy.com and customer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [process.env.INVOICE_EMAIL, email],
      subject: `Invoice for Order ${orderId}`,
      text: `Invoice details:

Order ID: ${orderId}
Customer: ${customer}
Phone: ${phone}
Email: ${email}
Items: ${JSON.stringify(items)}
Total: ${total}`,
      html: `
        <h2>Invoice - Cleaning Made Easy</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customer}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Items:</h3>
        <ul>
          ${items.map(item => `<li>${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}</li>`).join('')}
        </ul>
        <p><strong>Total:</strong> ${total}</p>
      `
    };
    
    if (emailEnabled) {
      await transporter.sendMail(mailOptions);
      
      // Update invoice record to mark email as sent
      await pool.execute(
        'UPDATE invoices SET sent_via_email = ? WHERE id = ?',
        [true, result.insertId]
      );
    } else {
      console.log('Email sending disabled. Would have sent:', mailOptions);
    }
    
    res.status(200).json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ message: 'Error sending invoice' });
  }
});

// Get financial reports (protected)
app.get('/api/reports/:type', authenticateAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = '';
    let params = [];
    
    switch (type) {
      case 'daily':
        query = `
          SELECT 
            DATE(created_at) as period,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE DATE(created_at) = ?
          GROUP BY DATE(created_at)
        `;
        params = [startDate];
        break;
      case 'weekly':
        query = `
          SELECT 
            YEARWEEK(created_at) as period,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE created_at BETWEEN ? AND ?
          GROUP BY YEARWEEK(created_at)
        `;
        params = [startDate, endDate];
        break;
      case 'monthly':
        query = `
          SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as period,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE created_at BETWEEN ? AND ?
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        `;
        params = [startDate, endDate];
        break;
      case 'yearly':
        query = `
          SELECT 
            YEAR(created_at) as period,
            COUNT(*) as total_orders,
            SUM(total_amount) as total_revenue
          FROM orders 
          WHERE created_at BETWEEN ? AND ?
          GROUP BY YEAR(created_at)
        `;
        params = [startDate, endDate];
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    const [rows] = await pool.execute(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching financial reports:', error);
    res.status(500).json({ message: 'Error fetching financial reports' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    database: pool ? 'Connected' : 'Not connected',
    email: emailEnabled ? 'Enabled' : 'Disabled'
  });
});

// Serve frontend static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying ${PORT + 1}...`);
    setTimeout(() => {
      server.close();
      app.listen(PORT + 1, () => {
        console.log(`Server is running on port ${PORT + 1}`);
      });
    }, 1000);
  } else {
    console.error('Server error:', error);
  }
});