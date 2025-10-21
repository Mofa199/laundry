// Test script to verify WhatsApp integration
console.log('WhatsApp Integration Test');
console.log('========================');

// Example WhatsApp URL format
const phoneNumber = '+255123456789'; // Replace with actual phone number
const message = 'Hello! This is a test message from Cleaning Made Easy.';

// Encode the message for URL
const encodedMessage = encodeURIComponent(message);
const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

console.log('Phone Number:', phoneNumber);
console.log('Message:', message);
console.log('Encoded Message:', encodedMessage);
console.log('WhatsApp URL:', whatsappUrl);
console.log('');
console.log('To test:');
console.log('1. Copy the WhatsApp URL above');
console.log('2. Paste it in your browser');
console.log('3. It should open WhatsApp Web with the pre-filled message');
console.log('4. You can then send the message to the specified number');