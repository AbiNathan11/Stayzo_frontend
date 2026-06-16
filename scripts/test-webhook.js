const crypto = require('crypto');

async function testWebhook() {
  const merchantId = '1236075';
  const orderId = 'BOOST_12345-uuid-67890_1700000000';
  const amount = '500.00';
  const currency = 'LKR';
  const statusCode = '2';
  const merchantSecret = 'MTU3MTgyNzQ1NDkzMjIxOTk2MTEwMTExMTI3NjQyOTc4OTk2MDY4';

  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = `${merchantId}${orderId}${amount}${currency}${statusCode}${hashedSecret}`;
  const md5sig = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

  const formData = new URLSearchParams();
  formData.append('merchant_id', merchantId);
  formData.append('order_id', orderId);
  formData.append('payhere_amount', amount);
  formData.append('payhere_currency', currency);
  formData.append('status_code', statusCode);
  formData.append('md5sig', md5sig);
  formData.append('payment_id', 'PAY123456789');
  formData.append('method', 'VISA');

  try {
    console.log('Sending webhook simulation...');
    const response = await fetch('http://localhost:3000/api/payments/payhere-notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${text}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testWebhook();
