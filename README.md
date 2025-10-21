# Laundry Website

A modern laundry service website with separate pages, admin functionality, and WhatsApp chatbot.

## Features

- **Separate Pages**: Home, About, Services, Order, Contact, and Admin pages
- **Responsive Design**: Works on all devices
- **Interactive Order Form**: Complete with all required fields
- **Admin Dashboard**: With order management and invoice generation
- **WhatsApp Chatbot**: For customer support
- **Modern UI**: Clean design with smooth animations

## Tech Stack

- React.js with React Router
- GSAP (GreenSock Animation Platform)
- Vite (Build tool)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd 3d-laundry
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5174`.

### Building for Production

To create a production build:

```bash
npm run build
```

### Previewing Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
  ├── components/          # Reusable components
  │   ├── WhatsAppBot.jsx  # WhatsApp chatbot
  ├── pages/               # Page components
  │   ├── Home.jsx         # Home page
  │   ├── About.jsx        # About page
  │   ├── Services.jsx     # Services page
  │   ├── Order.jsx        # Order form page
  │   ├── Contact.jsx      # Contact page
  │   └── Admin.jsx        # Admin dashboard
  ├── App.jsx             # Main application component
  ├── App.css             # Global styles
  └── main.jsx            # Application entry point
```

## Pages

1. **Home** - Introduction with water bubble animations
2. **About** - Information about service areas and washing schedule
3. **Services** - Pricing and service offerings
4. **Order** - Interactive form for placing laundry orders
5. **Contact** - Thank you message and contact information
6. **Admin** - Dashboard for managing orders (username: admin, password: laundry123)

## Admin Features

- Order management system
- Status updates for orders
- Invoice generation
- Customer information management

## WhatsApp Bot

- Interactive chatbot for customer support
- Answers common questions about services and pricing
- Provides assistance with ordering

## Future Enhancements

- Add map integration for service areas
- Implement order management system with database
- Add mobile payment integration (M-Pesa, TigoPesa, Airtel Money)
- Create customer login for order tracking
- Add live pickup tracking
- Implement SMS/email notifications