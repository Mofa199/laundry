# Laundry Website Backend

This is the backend for the Cleaning Made Easy laundry website.

## Prerequisites

1. Node.js (v14 or higher)
2. MySQL database server

## Setup

1. Install MySQL server:
   - Download and install MySQL from https://dev.mysql.com/downloads/mysql/
   - Create a database named `laundry_db`
   - Create a user with appropriate permissions

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual configuration:
     - Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
     - Email credentials (EMAIL_USER, EMAIL_PASS)

4. Initialize database tables:
   ```
   node config/initDb.js
   ```

5. Start the server:
   ```
   npm start
   ```

## Development

To run both frontend and backend simultaneously:
```
npm run dev:full
```

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/order` - Submit order form
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/invoice` - Generate and send invoice
- `GET /api/reports/:type` - Get financial reports (daily, weekly, monthly, yearly)

## Environment Variables

- `EMAIL_SERVICE` - SMTP service (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - App password for the email account
- `ADMIN_EMAIL` - Admin email address
- `BOOKING_EMAIL` - Booking email address
- `INVOICE_EMAIL` - Invoice email address
- `INFO_EMAIL` - Info email address
- `SUPPORT_EMAIL` - Support email address
- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: laundry_db)
- `PORT` - Server port (default: 3001)

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/order` - Submit order form
- `POST /api/invoice` - Send invoice

## Environment Variables

- `EMAIL_SERVICE` - SMTP service (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - App password for the email account
- `ADMIN_EMAIL` - Admin email address
- `BOOKING_EMAIL` - Booking email address
- `INVOICE_EMAIL` - Invoice email address
- `INFO_EMAIL` - Info email address
- `SUPPORT_EMAIL` - Support email address
- `PORT` - Server port (default: 3001)