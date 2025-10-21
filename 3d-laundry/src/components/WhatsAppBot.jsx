import React, { useState } from 'react';

const WhatsAppBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Cleaning Made Easy. How can I help you today?' }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    // Add user message to conversation
    const newUserMessage = { sender: 'user', text: message };
    setConversation([...conversation, newUserMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      
      // Simple bot logic
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        botResponse = 'Hello! How can I assist you with your laundry today?';
      } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
        botResponse = 'Our prices start at 300/= per item for regular clothes. Would you like to see our full pricing list?';
      } else if (message.toLowerCase().includes('pickup') || message.toLowerCase().includes('collect')) {
        botResponse = 'We offer free pickup and delivery in Mikocheni, Kiota Hostels, Tumaini University, Mwenge–Mlimani City, Ardhi, and Makongo Juu. Pickup days are Friday and Saturday.';
      } else if (message.toLowerCase().includes('order') || message.toLowerCase().includes('book')) {
        botResponse = 'You can place an order by visiting our Order page. Would you like me to send you a link?';
      } else if (message.toLowerCase().includes('invoice')) {
        botResponse = 'If you need your invoice, please provide your order ID and I can help you with that.';
      } else if (message.toLowerCase().includes('thank')) {
        botResponse = 'You\'re welcome! Is there anything else I can help you with?';
      } else {
        botResponse = 'Thank you for your message. Our team will get back to you shortly. You can also call us at +255 XXX XXX XXX for immediate assistance.';
      }
      
      const newBotMessage = { sender: 'bot', text: botResponse };
      setConversation(prev => [...prev, newBotMessage]);
    }, 1000);
    
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Function to send invoice via WhatsApp
  const sendInvoice = (invoiceData) => {
    const message = `*Cleaning Made Easy Invoice*
    
*Order ID:* ${invoiceData.orderId}
*Customer:* ${invoiceData.customer}
*Phone:* ${invoiceData.phone}
*Email:* ${invoiceData.email}

*Items:*
${invoiceData.items.map(item => `${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}/=`).join('\n')}

*Total:* Tsh ${invoiceData.total}/=

Thank you for choosing Cleaning Made Easy!
Mikocheni, Dar es Salaam
+255 XXX XXX XXX
info@cleaningmadeasy.com`;

    // Replace special characters for URL encoding
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${invoiceData.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Add confirmation to chat
    const confirmationMessage = { sender: 'bot', text: 'I\'ve sent your invoice via WhatsApp. Please check your messages!' };
    setConversation(prev => [...prev, confirmationMessage]);
  };

  // Function to handle invoice requests
  const handleInvoiceRequest = (orderId) => {
    // In a real app, this would fetch invoice data from the backend
    // For now, we'll simulate with sample data
    const invoiceData = {
      orderId: orderId || 'ORD-1234',
      customer: 'John Doe',
      phone: '+255 712 345 678',
      email: 'john@example.com',
      items: [
        { name: 'Regular Clothes', price: 300, quantity: 15, subtotal: 4500 }
      ],
      total: 4500
    };
    
    sendInvoice(invoiceData);
  };

  return (
    <div className="whatsapp-bot">
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-icon">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div className="chat-title">
                <h3>Cleaning Made Easy Assistant</h3>
                <p>Typically replies in a few minutes</p>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  {msg.sender === 'bot' && msg.text.includes('invoice') && (
                    <div className="invoice-request">
                      <button className="btn btn-small" onClick={() => handleInvoiceRequest()}>
                        <i className="fas fa-file-invoice"></i> Send Sample Invoice
                      </button>
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="message-avatar user">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fab fa-whatsapp"></i>
            <span className="chat-label">Chat with us</span>
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppBot;