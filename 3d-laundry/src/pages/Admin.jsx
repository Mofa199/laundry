import React, { useState, useEffect } from 'react';
import '../App.css';

// Define the API base URL - use relative path for production
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:30021';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Authenticate with backend
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        onLogin();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="section admin-login-section">
        <div className="container">
          <div className="login-container">
            <div className="login-header">
              <div className="login-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h1>Admin Login</h1>
              <p>Access the Cleaning Made Easy Laundry administration panel</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Forgot your password? Contact system administrator.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    orderId: '',
    items: [],
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderLimit, setOrderLimit] = useState(50); // Default limit
  const [isOrderClosed, setIsOrderClosed] = useState(false);
  const [customInvoiceTemplate, setCustomInvoiceTemplate] = useState({
    businessName: 'Cleaning Made Easy',
    businessAddress: 'Mikocheni, Dar es Salaam',
    businessPhone: '+255 XXX XXX XXX',
    businessEmail: 'info@cleaningmadeasy.com',
    footerMessage: 'Thank you for choosing Cleaning Made Easy!'
  });
  
  // Report filters
  const [reportFilters, setReportFilters] = useState({
    daily: { date: new Date().toISOString().split('T')[0] },
    weekly: { startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
    monthly: { startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] },
    yearly: { startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    orders: false,
    invoices: false,
    reports: false
  });
  
  // Error states
  const [errors, setErrors] = useState({
    orders: '',
    invoices: '',
    reports: ''
  });

  // Load settings from localStorage if available
  useEffect(() => {
    const savedLimit = localStorage.getItem('orderLimit');
    const savedClosed = localStorage.getItem('isOrderClosed');
    const savedTemplate = localStorage.getItem('invoiceTemplate');
    
    if (savedLimit) setOrderLimit(parseInt(savedLimit));
    if (savedClosed) setIsOrderClosed(JSON.parse(savedClosed));
    if (savedTemplate) {
      try {
        setCustomInvoiceTemplate(JSON.parse(savedTemplate));
      } catch (e) {
        console.error('Failed to parse invoice template from localStorage');
      }
    }
  }, []);

  // Fetch orders, invoices, and reports from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          onLogout();
          return;
        }

        // Fetch orders
        setLoading(prev => ({ ...prev, orders: true }));
        setErrors(prev => ({ ...prev, orders: '' }));
        
        const ordersResponse = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (ordersResponse.status === 401) {
          onLogout();
          return;
        }
        
        if (!ordersResponse.ok) {
          throw new Error(`HTTP error! status: ${ordersResponse.status}`);
        }
        
        const ordersData = await ordersResponse.json();
        
        // Transform data to match existing structure
        const transformedOrders = ordersData.map(order => ({
          id: order.order_id,
          customer: order.customer_name,
          phone: order.customer_phone,
          email: order.customer_email,
          location: order.customer_location,
          serviceType: order.service_type,
          orderType: order.order_type,
          itemCount: order.quick_order || (order.tshirts + order.dresses + order.jeans + order.curtains + order.baskets),
          pickupDay: order.pickup_day,
          timeSlot: order.time_slot,
          status: order.status,
          notes: order.notes,
          date: new Date(order.created_at).toISOString().split('T')[0],
          total_amount: order.total_amount
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrors(prev => ({ ...prev, orders: 'Failed to load orders. Please try again.' }));
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
      
      try {
        // Get token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          onLogout();
          return;
        }
        
        // Fetch invoices
        setLoading(prev => ({ ...prev, invoices: true }));
        setErrors(prev => ({ ...prev, invoices: '' }));
        
        const invoicesResponse = await fetch(`${API_BASE_URL}/api/invoices`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (invoicesResponse.status === 401) {
          onLogout();
          return;
        }
        
        if (!invoicesResponse.ok) {
          throw new Error(`HTTP error! status: ${invoicesResponse.status}`);
        }
        
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setErrors(prev => ({ ...prev, invoices: 'Failed to load invoices. Please try again.' }));
      } finally {
        setLoading(prev => ({ ...prev, invoices: false }));
      }
      
      // Fetch initial reports
      fetchReport('daily', reportFilters.daily.date);
      fetchReport('weekly', reportFilters.weekly.startDate, reportFilters.weekly.endDate);
      fetchReport('monthly', reportFilters.monthly.startDate, reportFilters.monthly.endDate);
      fetchReport('yearly', reportFilters.yearly.startDate, reportFilters.yearly.endDate);
    };
    
    fetchData();
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('orderLimit', orderLimit);
    localStorage.setItem('isOrderClosed', JSON.stringify(isOrderClosed));
    localStorage.setItem('invoiceTemplate', JSON.stringify(customInvoiceTemplate));
  };
  
  // Enhanced authentication with token validation
  const handleLogout = () => {
    // In a real implementation, you would invalidate the token on the server
    localStorage.removeItem('adminToken');
    onLogout();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error('Failed to update order status');
        alert('Failed to update order status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };
  
  // Fetch financial reports
  const fetchReport = async (type, startDate, endDate) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      setLoading(prev => ({ ...prev, reports: true }));
      setErrors(prev => ({ ...prev, reports: '' }));
      
      let url = `${API_BASE_URL}/api/reports/${type}`;
      if (type === 'daily') {
        url += `?startDate=${startDate}`;
      } else {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setReports(prev => ({
        ...prev,
        [type]: data
      }));
    } catch (error) {
      console.error(`Error fetching ${type} report:`, error);
      setErrors(prev => ({ ...prev, reports: `Failed to load ${type} report. Please try again.` }));
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };
  
  // Update report filters
  const updateReportFilter = (type, field, value) => {
    setReportFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  // Generate report based on current filters
  const generateReport = (type) => {
    if (type === 'daily') {
      fetchReport(type, reportFilters[type].date);
    } else {
      fetchReport(type, reportFilters[type].startDate, reportFilters[type].endDate);
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };
  
  // Get report period label
  const getReportPeriodLabel = (type, data) => {
    if (!data || data.length === 0) return '';
    
    switch (type) {
      case 'daily':
        return formatDate(data[0].period);
      case 'weekly':
        return `Week ${data[0].period}`;
      case 'monthly':
        return data[0].period;
      case 'yearly':
        return data[0].period;
      default:
        return '';
    }
  };

  const generateInvoice = async (order) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch detailed order information from backend
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orderDetails = await response.json();
      
      // Prepare items based on order type
      let items = [];
      if (orderDetails.order_type === 'quick') {
        items = [{
          name: 'Garments',
          price: 300,
          quantity: orderDetails.quick_order,
          subtotal: orderDetails.total_amount
        }];
      } else {
        items = [
          { name: 'T-shirts', price: 300, quantity: orderDetails.tshirts, subtotal: orderDetails.tshirts * 300 },
          { name: 'Dresses', price: 300, quantity: orderDetails.dresses, subtotal: orderDetails.dresses * 300 },
          { name: 'Jeans', price: 500, quantity: orderDetails.jeans, subtotal: orderDetails.jeans * 500 },
          { name: 'Curtains', price: 1000, quantity: orderDetails.curtains, subtotal: orderDetails.curtains * 1000 },
          { name: 'Baskets', price: 9000, quantity: orderDetails.baskets, subtotal: orderDetails.baskets * 9000 }
        ];
        // Filter out items with zero quantity
        items = items.filter(item => item.quantity > 0);
      }
      
      setInvoiceData({
        orderId: order.id,
        items,
        total: orderDetails.total_amount,
        customer: orderDetails.customer_name,
        phone: orderDetails.customer_phone,
        email: orderDetails.customer_email
      });
      
      setShowInvoiceForm(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };
  
  // Enhanced sendInvoice function with WhatsApp tracking
  const sendInvoice = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE_URL}/api/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: invoiceData.orderId,
          customer: invoiceData.customer,
          phone: invoiceData.phone,
          email: invoiceData.email,
          items: invoiceData.items,
          total: invoiceData.total
        }),
      });
      
      if (response.status === 401) {
        handleLogout();
        return;
      }
      
      const result = await response.json();
      
      if (response.ok) {
        // Update local invoices state to show sent status
        const newInvoice = {
          id: Date.now(), // Temporary ID
          orderId: invoiceData.orderId,
          customer: invoiceData.customer,
          total: invoiceData.total,
          sentViaEmail: true,
          sentViaWhatsApp: true,
          date: new Date().toISOString().split('T')[0]
        };
        
        setInvoices(prev => [...prev, newInvoice]);
        
        alert(`Invoice for ${invoiceData.orderId} sent to customer via email and WhatsApp!`);
        setShowInvoiceForm(false);
        setInvoiceData({ orderId: '', items: [], total: 0 });
      } else {
        alert(`Error sending invoice: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Send invoice via WhatsApp
  const sendInvoiceViaWhatsApp = async (invoice) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Get order details for the invoice
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders/${invoice.order_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (orderResponse.status === 401) {
        handleLogout();
        return;
      }
      
      if (!orderResponse.ok) {
        throw new Error(`HTTP error! status: ${orderResponse.status}`);
      }
      
      const orderDetails = await orderResponse.json();
      
      // Create WhatsApp message
      let message = `*Invoice from Cleaning Made Easy*\n\n`;
      message += `Order ID: ${invoice.order_id}\n`;
      message += `Customer: ${invoice.customer_name}\n`;
      message += `Date: ${new Date(invoice.created_at).toLocaleDateString()}\n\n`;
      message += `*Items:*\n`;
      
      // Parse items from JSON
      const items = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items;
      
      items.forEach(item => {
        message += `${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}\n`;
      });
      
      message += `\n*Total: ${formatCurrency(invoice.total_amount)}*\n\n`;
      message += `Thank you for choosing Cleaning Made Easy!`;
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${invoice.customer_phone}?text=${encodedMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Update invoice status in database
      const updateResponse = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/whatsapp`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (updateResponse.status === 401) {
        handleLogout();
        return;
      }
      
      if (updateResponse.ok) {
        // Update local state
        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { ...inv, sent_via_whatsapp: true } : inv
        ));
      }
    } catch (error) {
      console.error('Error sending invoice via WhatsApp:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle order closing
  const toggleOrderClosing = () => {
    setIsOrderClosed(!isOrderClosed);
    saveSettings();
  };

  // Update order limit
  const updateOrderLimit = (e) => {
    const newLimit = parseInt(e.target.value);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setOrderLimit(newLimit);
      saveSettings();
    }
  };

  // Get today's order count
  const getTodaysOrderCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => order.date === today).length;
  };

  // Check if order limit is reached
  const isOrderLimitReached = () => {
    return getTodaysOrderCount() >= orderLimit;
  };

  // Update invoice template
  const updateInvoiceTemplate = (field, value) => {
    setCustomInvoiceTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save invoice template
  const saveInvoiceTemplate = () => {
    localStorage.setItem('invoiceTemplate', JSON.stringify(customInvoiceTemplate));
    alert('Invoice template saved successfully!');
  };

  return (
    <div className="admin-page">
      <section className="section admin-dashboard">
        <div className="container">
          <div className="admin-header">
            <div className="header-content">
              <div className="header-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h1>Admin Dashboard</h1>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          
          {/* Order Settings Panel */}
          <div className="admin-settings">
            <div className="settings-header">
              <h2>Order Management Settings</h2>
            </div>
            
            <div className="settings-content">
              <div className="setting-item">
                <label htmlFor="orderLimit">Daily Order Limit:</label>
                <input 
                  type="number" 
                  id="orderLimit" 
                  value={orderLimit} 
                  onChange={updateOrderLimit}
                  min="0"
                  className="setting-input"
                />
              </div>
              
              <div className="setting-item">
                <label>Close Orders for Today:</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="orderCloseToggle" 
                    checked={isOrderClosed}
                    onChange={toggleOrderClosing}
                  />
                  <label htmlFor="orderCloseToggle" className="switch-label">
                    {isOrderClosed ? 'Closed' : 'Open'}
                  </label>
                </div>
              </div>
              
              <div className="setting-item">
                <p>Current orders today: {getTodaysOrderCount()}</p>
                <p>Status: {isOrderClosed ? 'Closed' : 'Open'} {isOrderLimitReached() && !isOrderClosed && '(Limit Reached)'}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-number">{orders.length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p className="stat-number">{orders.filter(o => o.status === 'Pending').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-sync"></i>
              </div>
              <div className="stat-content">
                <h3>In Progress</h3>
                <p className="stat-number">{orders.filter(o => o.status === 'In Progress').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>Completed</h3>
                <p className="stat-number">{orders.filter(o => o.status === 'Confirmed').length}</p>
              </div>
            </div>
            
            {/* Revenue Tracking */}
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-number">
                  {formatCurrency(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          
          {/* Financial Reports Section */}
          <div className="admin-reports">
            <div className="section-header">
              <h2>Financial Reports</h2>
              <p>Track revenue and order volume analytics</p>
            </div>
            
            <div className="reports-grid">
              {/* Daily Report */}
              <div className="report-card">
                <h3>Daily Report</h3>
                <div className="report-filters">
                  <input 
                    type="date" 
                    value={reportFilters.daily.date}
                    onChange={(e) => updateReportFilter('daily', 'date', e.target.value)}
                  />
                  <button onClick={() => generateReport('daily')} className="btn btn-small" disabled={loading.reports}>
                    {loading.reports ? 'Loading...' : 'Generate'}
                  </button>
                </div>
                {errors.reports && <div className="error-message">{errors.reports}</div>}
                {reports.daily.length > 0 ? (
                  <div className="report-data">
                    <p>Period: {getReportPeriodLabel('daily', reports.daily)}</p>
                    <p>Orders: {reports.daily[0].total_orders}</p>
                    <p>Revenue: {formatCurrency(reports.daily[0].total_revenue)}</p>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
              
              {/* Weekly Report */}
              <div className="report-card">
                <h3>Weekly Report</h3>
                <div className="report-filters">
                  <input 
                    type="date" 
                    value={reportFilters.weekly.startDate}
                    onChange={(e) => updateReportFilter('weekly', 'startDate', e.target.value)}
                  />
                  <input 
                    type="date" 
                    value={reportFilters.weekly.endDate}
                    onChange={(e) => updateReportFilter('weekly', 'endDate', e.target.value)}
                  />
                  <button onClick={() => generateReport('weekly')} className="btn btn-small" disabled={loading.reports}>
                    {loading.reports ? 'Loading...' : 'Generate'}
                  </button>
                </div>
                {errors.reports && <div className="error-message">{errors.reports}</div>}
                {reports.weekly.length > 0 ? (
                  <div className="report-data">
                    <p>Period: {getReportPeriodLabel('weekly', reports.weekly)}</p>
                    <p>Orders: {reports.weekly[0].total_orders}</p>
                    <p>Revenue: {formatCurrency(reports.weekly[0].total_revenue)}</p>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
              
              {/* Monthly Report */}
              <div className="report-card">
                <h3>Monthly Report</h3>
                <div className="report-filters">
                  <input 
                    type="date" 
                    value={reportFilters.monthly.startDate}
                    onChange={(e) => updateReportFilter('monthly', 'startDate', e.target.value)}
                  />
                  <input 
                    type="date" 
                    value={reportFilters.monthly.endDate}
                    onChange={(e) => updateReportFilter('monthly', 'endDate', e.target.value)}
                  />
                  <button onClick={() => generateReport('monthly')} className="btn btn-small" disabled={loading.reports}>
                    {loading.reports ? 'Loading...' : 'Generate'}
                  </button>
                </div>
                {errors.reports && <div className="error-message">{errors.reports}</div>}
                {reports.monthly.length > 0 ? (
                  <div className="report-data">
                    <p>Period: {getReportPeriodLabel('monthly', reports.monthly)}</p>
                    <p>Orders: {reports.monthly[0].total_orders}</p>
                    <p>Revenue: {formatCurrency(reports.monthly[0].total_revenue)}</p>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
              
              {/* Yearly Report */}
              <div className="report-card">
                <h3>Yearly Report</h3>
                <div className="report-filters">
                  <input 
                    type="date" 
                    value={reportFilters.yearly.startDate}
                    onChange={(e) => updateReportFilter('yearly', 'startDate', e.target.value)}
                  />
                  <input 
                    type="date" 
                    value={reportFilters.yearly.endDate}
                    onChange={(e) => updateReportFilter('yearly', 'endDate', e.target.value)}
                  />
                  <button onClick={() => generateReport('yearly')} className="btn btn-small" disabled={loading.reports}>
                    {loading.reports ? 'Loading...' : 'Generate'}
                  </button>
                </div>
                {errors.reports && <div className="error-message">{errors.reports}</div>}
                {reports.yearly.length > 0 ? (
                  <div className="report-data">
                    <p>Period: {getReportPeriodLabel('yearly', reports.yearly)}</p>
                    <p>Orders: {reports.yearly[0].total_orders}</p>
                    <p>Revenue: {formatCurrency(reports.yearly[0].total_revenue)}</p>
                  </div>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Invoices Section */}
          <div className="admin-invoices">
            <div className="section-header">
              <h2>Invoices</h2>
              <p>Track invoices with sent status</p>
            </div>
            
            {loading.invoices && <div className="loading">Loading invoices...</div>}
            {errors.invoices && <div className="error-message">{errors.invoices}</div>}
            
            <div className="invoices-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Sent via Email</th>
                    <th>Sent via WhatsApp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.order_id}</td>
                      <td>{invoice.customer_name}</td>
                      <td>{formatDate(invoice.created_at)}</td>
                      <td>{formatCurrency(invoice.total_amount)}</td>
                      <td>
                        <span className={`status-badge ${invoice.sent_via_email ? 'sent' : 'pending'}`}>
                          {invoice.sent_via_email ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${invoice.sent_via_whatsapp ? 'sent' : 'pending'}`}>
                          {invoice.sent_via_whatsapp ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!invoice.sent_via_whatsapp && (
                            <button 
                              className="btn btn-small" 
                              onClick={() => sendInvoiceViaWhatsApp(invoice)}
                            >
                              <i className="fab fa-whatsapp"></i> Send
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="admin-orders">
            <div className="section-header">
              <h2>Order Management</h2>
              <p>Manage and track all customer orders</p>
            </div>
            
            {loading.orders && <div className="loading">Loading orders...</div>}
            {errors.orders && <div className="error-message">{errors.orders}</div>}
            
            <div className="orders-controls">
              <div className="search-filter">
                <div className="search-input">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Service</th>
                    <th>Pickup Day</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.serviceType}</td>
                      <td>{order.pickupDay}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-small" 
                            onClick={() => setSelectedOrder(order)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button 
                            className="btn btn-small" 
                            onClick={() => generateInvoice(order)}
                          >
                            <i className="fas fa-file-invoice"></i> Invoice
                          </button>
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {selectedOrder && (
            <div className="order-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Order Details - {selectedOrder.id}</h2>
                  <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                </div>
                
                <div className="order-details-grid">
                  <div className="detail-item">
                    <label>Customer:</label>
                    <p>{selectedOrder.customer}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <p>{selectedOrder.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <p>{selectedOrder.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <p>{selectedOrder.location}</p>
                  </div>
                  <div className="detail-item">
                    <label>Service Type:</label>
                    <p>{selectedOrder.serviceType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Order Type:</label>
                    <p>{selectedOrder.orderType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Item Count:</label>
                    <p>{selectedOrder.itemCount}</p>
                  </div>
                  <div className="detail-item">
                    <label>Pickup Day:</label>
                    <p>{selectedOrder.pickupDay}</p>
                  </div>
                  <div className="detail-item">
                    <label>Time Slot:</label>
                    <p>{selectedOrder.timeSlot}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <p>{selectedOrder.date}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Notes:</label>
                    <p>{selectedOrder.notes || 'No special instructions'}</p>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                  <button className="btn btn-primary" onClick={() => generateInvoice(selectedOrder)}>Generate Invoice</button>
                </div>
              </div>
            </div>
          )}
          
          {showInvoiceForm && (
            <div className="order-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Invoice - {invoiceData.orderId}</h2>
                  <button className="close-btn" onClick={() => setShowInvoiceForm(false)}>×</button>
                </div>
                
                <div className="invoice-template-settings">
                  <h3>Invoice Template Settings</h3>
                  <div className="form-group">
                    <label>Business Name:</label>
                    <input 
                      type="text" 
                      value={customInvoiceTemplate.businessName}
                      onChange={(e) => updateInvoiceTemplate('businessName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address:</label>
                    <input 
                      type="text" 
                      value={customInvoiceTemplate.businessAddress}
                      onChange={(e) => updateInvoiceTemplate('businessAddress', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input 
                      type="text" 
                      value={customInvoiceTemplate.businessPhone}
                      onChange={(e) => updateInvoiceTemplate('businessPhone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input 
                      type="text" 
                      value={customInvoiceTemplate.businessEmail}
                      onChange={(e) => updateInvoiceTemplate('businessEmail', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Footer Message:</label>
                    <textarea 
                      value={customInvoiceTemplate.footerMessage}
                      onChange={(e) => updateInvoiceTemplate('footerMessage', e.target.value)}
                    ></textarea>
                  </div>
                  <button className="btn btn-primary" onClick={saveInvoiceTemplate}>Save Template</button>
                </div>
                
                <div className="invoice-details">
                  <div className="invoice-header">
                    <h2>{customInvoiceTemplate.businessName}</h2>
                    <p>{customInvoiceTemplate.businessAddress}</p>
                    <p>{customInvoiceTemplate.businessPhone} | {customInvoiceTemplate.businessEmail}</p>
                  </div>
                  
                  <div className="invoice-customer-info">
                    <h3>Bill To:</h3>
                    <p>{invoiceData.customer}</p>
                    <p>{invoiceData.phone}</p>
                    <p>{invoiceData.email}</p>
                  </div>
                  
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.price}/=</td>
                          <td>{item.quantity}</td>
                          <td>{item.subtotal}/=</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td><strong>{invoiceData.total}/=</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <div className="invoice-footer">
                    <p>{customInvoiceTemplate.footerMessage}</p>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowInvoiceForm(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={sendInvoice}>
                    <i className="fab fa-whatsapp"></i> Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in and validate token
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      // In a real implementation, you would validate the token with the backend
      // For now, we'll assume it's valid
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  return isLoggedIn ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}

export default Admin;