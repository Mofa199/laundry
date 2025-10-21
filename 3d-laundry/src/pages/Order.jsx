import React, { useState } from 'react';
import '../App.css';

function Order() {
  const [orderType, setOrderType] = useState('quick');
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: ''
  });
  const [serviceType, setServiceType] = useState('washing');
  const [quickOrder, setQuickOrder] = useState('');
  const [detailedOrder, setDetailedOrder] = useState({
    tshirt: 0,
    dress: 0,
    jeans: 0,
    curtain: 0,
    basket: 0
  });
  const [pickupSchedule, setPickupSchedule] = useState({
    day: 'friday',
    time: 'morning'
  });
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const calculateTotal = () => {
    if (orderType === 'quick') {
      return quickOrder * 300;
    } else {
      const tshirtTotal = detailedOrder.tshirt * 300;
      const dressTotal = detailedOrder.dress * 300;
      const jeansTotal = detailedOrder.jeans * 500;
      const curtainTotal = detailedOrder.curtain * 1000;
      const basketTotal = detailedOrder.basket * 9000;
      
      return tshirtTotal + dressTotal + jeansTotal + curtainTotal + basketTotal;
    }
  };

  const generateOrderId = () => {
    return 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate order ID
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    
    // Send data to backend API
    try {
      const response = await fetch('http://localhost:3001/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: customerDetails.fullName,
          phone: customerDetails.phone,
          email: customerDetails.email,
          location: customerDetails.location,
          serviceType: serviceType,
          orderType: orderType,
          quickOrder: quickOrder,
          detailedOrder: detailedOrder,
          pickupDay: pickupSchedule.day,
          timeSlot: pickupSchedule.time,
          notes: notes
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        // Show confirmation message
        alert(`Order ${newOrderId} submitted successfully! You will receive a confirmation shortly at bookyourwash@cleaningmadeasy.com.`);
      } else {
        alert(`Error submitting order: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again later.');
    }
  };

  const resetForm = () => {
    setOrderType('quick');
    setCustomerDetails({
      fullName: '',
      phone: '',
      email: '',
      location: ''
    });
    setServiceType('washing');
    setQuickOrder('');
    setDetailedOrder({
      tshirt: 0,
      dress: 0,
      jeans: 0,
      curtain: 0,
      basket: 0
    });
    setPickupSchedule({
      day: 'friday',
      time: 'morning'
    });
    setNotes('');
    setIsSubmitted(false);
    setOrderId('');
  };

  const sendInvoiceToWhatsApp = async () => {
    const total = calculateTotal();
    
    // Prepare items array
    let items = [];
    if (orderType === 'quick') {
      items = [{
        name: 'Garments',
        quantity: quickOrder,
        price: 300,
        subtotal: total
      }];
    } else {
      items = [
        { name: 'T-shirts', quantity: detailedOrder.tshirt, price: 300, subtotal: detailedOrder.tshirt * 300 },
        { name: 'Dresses', quantity: detailedOrder.dress, price: 300, subtotal: detailedOrder.dress * 300 },
        { name: 'Jeans', quantity: detailedOrder.jeans, price: 500, subtotal: detailedOrder.jeans * 500 },
        { name: 'Curtains', quantity: detailedOrder.curtain, price: 1000, subtotal: detailedOrder.curtain * 1000 },
        { name: 'Baskets', quantity: detailedOrder.basket, price: 9000, subtotal: detailedOrder.basket * 9000 }
      ];
      // Filter out items with zero quantity
      items = items.filter(item => item.quantity > 0);
    }
    
    // Send invoice through backend API
    try {
      const response = await fetch('http://localhost:3001/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          customer: customerDetails.fullName,
          phone: customerDetails.phone,
          email: customerDetails.email,
          items: items,
          total: total
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Create WhatsApp message
        const message = `*Cleaning Made Easy Invoice*
        
*Order ID:* ${orderId}
*Customer:* ${customerDetails.fullName}
*Phone:* ${customerDetails.phone}
*Email:* ${customerDetails.email}

*Items:*
${items.map(item => `${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}/=`).join('\n')}
*Total:* Tsh ${total}/=

Thank you for choosing Cleaning Made Easy!
Mikocheni, Dar es Salaam
+255 XXX XXX XXX
info@cleaningmadeasy.com`;

        // Replace special characters for URL encoding
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${customerDetails.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
      } else {
        alert(`Error sending invoice: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice. Please try again later.');
      
      // Fallback to direct WhatsApp link
      const message = `*Cleaning Made Easy Invoice*
      
*Order ID:* ${orderId}
*Customer:* ${customerDetails.fullName}
*Phone:* ${customerDetails.phone}
*Email:* ${customerDetails.email}

*Items:*
${items.map(item => `${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}/=`).join('\n')}
*Total:* Tsh ${total}/=

Thank you for choosing Cleaning Made Easy!
Mikocheni, Dar es Salaam
+255 XXX XXX XXX
info@cleaningmadeasy.com`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${customerDetails.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isSubmitted) {
    return (
      <div className="order-page">
        <section className="section page-header-section">
          <div className="container">
            <div className="page-header-content">
              <h1>Order Confirmation</h1>
              <p className="page-subtitle">Your order has been successfully submitted</p>
            </div>
          </div>
        </section>
        
        <section className="section order-confirmation">
          <div className="container">
            <div className="confirmation-card">
              <div className="confirmation-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Thank You for Your Order!</h2>
              <p>Your order has been received and is being processed.</p>
              
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <label>Order ID:</label>
                  <p>{orderId}</p>
                </div>
                <div className="summary-item">
                  <label>Customer:</label>
                  <p>{customerDetails.fullName}</p>
                </div>
                <div className="summary-item">
                  <label>Total Amount:</label>
                  <p>Tsh {calculateTotal()}/=</p>
                </div>
                <div className="summary-item">
                  <label>Pickup Schedule:</label>
                  <p>{pickupSchedule.day} ({pickupSchedule.time})</p>
                </div>
              </div>
              
              <div className="confirmation-actions">
                <button className="btn btn-primary" onClick={sendInvoiceToWhatsApp}>
                  <i className="fab fa-whatsapp"></i> Send Invoice via WhatsApp
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Place Another Order
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="order-page">
      <section className="section page-header-section">
        <div className="container">
          <div className="page-header-content">
            <h1>Place Your Order</h1>
            <p className="page-subtitle">Simple and convenient laundry service booking</p>
          </div>
        </div>
      </section>
      
      <section className="section order-process">
        <div className="container">
          <div className="process-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-user"></i>
              </div>
              <div className="step-label">Customer Details</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-concierge-bell"></i>
              </div>
              <div className="step-label">Service Type</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-list"></i>
              </div>
              <div className="step-label">Order Details</div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="step-label">Schedule</div>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-icon">
                <i className="fas fa-check"></i>
              </div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section order-form-section">
        <div className="container">
          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Customer Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    placeholder="Enter your full name" 
                    value={customerDetails.fullName}
                    onChange={(e) => setCustomerDetails({...customerDetails, fullName: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="Enter your phone number" 
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <select 
                    id="location" 
                    value={customerDetails.location}
                    onChange={(e) => setCustomerDetails({...customerDetails, location: e.target.value})}
                    required
                  >
                    <option value="">Select your location</option>
                    <option value="mikocheni">Mikocheni</option>
                    <option value="kiota">Kiota Hostels</option>
                    <option value="tumaini">Tumaini University</option>
                    <option value="mlimani">Mwenge–Mlimani City</option>
                    <option value="ardhi">Ardhi University</option>
                    <option value="makongo">Makongo Juu</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Service Type</h2>
              <div className="radio-group">
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="serviceType" 
                    value="washing" 
                    checked={serviceType === 'washing'}
                    onChange={() => setServiceType('washing')}
                  />
                  <span className="radio-label">Washing Only</span>
                </label>
                
                <label className="radio-option">
                  <input 
                    type="radio" 
                    name="serviceType" 
                    value="washingIroning" 
                    checked={serviceType === 'washingIroning'}
                    onChange={() => setServiceType('washingIroning')}
                  />
                  <span className="radio-label">Washing + Ironing</span>
                </label>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Order Type</h2>
              <div className="tabs">
                <button 
                  type="button"
                  className={`tab ${orderType === 'quick' ? 'active' : ''}`} 
                  onClick={() => setOrderType('quick')}
                >
                  Quick Order
                </button>
                <button 
                  type="button"
                  className={`tab ${orderType === 'detailed' ? 'active' : ''}`} 
                  onClick={() => setOrderType('detailed')}
                >
                  Detailed Order
                </button>
              </div>
              
              {orderType === 'quick' ? (
                <div className="tab-content">
                  <div className="form-group">
                    <label htmlFor="itemCount">Number of garments/items</label>
                    <input 
                      type="number" 
                      id="itemCount" 
                      placeholder="e.g. 20 items" 
                      min="1" 
                      value={quickOrder}
                      onChange={(e) => setQuickOrder(e.target.value)}
                    />
                  </div>
                  <p className="note">Invoice will be confirmed after inspection.</p>
                  {quickOrder && (
                    <div className="estimated-total">
                      <strong>Estimated Total: Tsh {calculateTotal()}/=</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className="tab-content">
                  <div className="detailed-order-table">
                    <div className="table-header">
                      <div>Item</div>
                      <div>Price</div>
                      <div>Quantity</div>
                      <div>Subtotal</div>
                    </div>
                    
                    <div className="table-row">
                      <div>T-shirt</div>
                      <div>300</div>
                      <div>
                        <input 
                          type="number" 
                          min="0" 
                          value={detailedOrder.tshirt}
                          onChange={(e) => setDetailedOrder({...detailedOrder, tshirt: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>{detailedOrder.tshirt * 300}/=</div>
                    </div>
                    
                    <div className="table-row">
                      <div>Dress</div>
                      <div>300</div>
                      <div>
                        <input 
                          type="number" 
                          min="0" 
                          value={detailedOrder.dress}
                          onChange={(e) => setDetailedOrder({...detailedOrder, dress: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>{detailedOrder.dress * 300}/=</div>
                    </div>
                    
                    <div className="table-row">
                      <div>Jeans</div>
                      <div>500</div>
                      <div>
                        <input 
                          type="number" 
                          min="0" 
                          value={detailedOrder.jeans}
                          onChange={(e) => setDetailedOrder({...detailedOrder, jeans: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>{detailedOrder.jeans * 500}/=</div>
                    </div>
                    
                    <div className="table-row">
                      <div>Curtain</div>
                      <div>1000</div>
                      <div>
                        <input 
                          type="number" 
                          min="0" 
                          value={detailedOrder.curtain}
                          onChange={(e) => setDetailedOrder({...detailedOrder, curtain: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>{detailedOrder.curtain * 1000}/=</div>
                    </div>
                    
                    <div className="table-row">
                      <div>Basket</div>
                      <div>9000</div>
                      <div>
                        <input 
                          type="number" 
                          min="0" 
                          value={detailedOrder.basket}
                          onChange={(e) => setDetailedOrder({...detailedOrder, basket: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>{detailedOrder.basket * 9000}/=</div>
                    </div>
                    
                    <div className="table-total">
                      <div><strong>Total: Tsh {calculateTotal()}/=</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h2>Pickup Schedule</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupDay">Pickup Day</label>
                  <select 
                    id="pickupDay" 
                    value={pickupSchedule.day}
                    onChange={(e) => setPickupSchedule({...pickupSchedule, day: e.target.value})}
                  >
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="timeSlot">Pickup Time</label>
                  <select 
                    id="timeSlot" 
                    value={pickupSchedule.time}
                    onChange={(e) => setPickupSchedule({...pickupSchedule, time: e.target.value})}
                  >
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 7PM)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Additional Notes</h2>
              <textarea 
                placeholder="Any special instructions? e.g. Handle jacket with care." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary full-width">Submit Order</button>
            </div>
          </form>
        </div>
      </section>
      
      <section className="section order-help">
        <div className="container">
          <div className="help-content">
            <h2>Need Help?</h2>
            <p>If you have any questions about placing your order, our customer service team is here to help.</p>
            <div className="contact-options">
              <div className="contact-option">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <p>+255 XXX XXX XXX</p>
              </div>
              <div className="contact-option">
                <div className="contact-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <p>Chat with us (bottom right)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Order;