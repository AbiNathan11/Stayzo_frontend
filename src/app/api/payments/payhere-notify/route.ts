import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'MTU3MTgyNzQ1NDkzMjIxOTk2MTEwMTExMTI3NjQyOTc4OTk2MDY4';

    // Verify MD5 Signature
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const localHashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const localMd5sig = crypto.createHash('md5').update(localHashString).digest('hex').toUpperCase();

    if (localMd5sig !== md5sig) {
      console.error('Invalid PayHere MD5 signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Check if payment was successful (status_code 2 means success in PayHere)
    if (status_code === '2' && order_id.startsWith('BOOST_')) {
      // Extract Property ID from the order_id (Format: BOOST_PROP123_1716700000)
      const parts = order_id.split('_');
      if (parts.length >= 3) {
        // the property ID might have hyphens (UUID), so we should join the parts between BOOST_ and _TIMESTAMP
        // Or better: BOOST_{PROPERTY_ID}_{TIMESTAMP}
        const propertyId = parts.slice(1, parts.length - 1).join('_');
        
        // Notify Backend to mark property as boosted and create transaction
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const boostResponse = await fetch(`${backendUrl}/api/properties/${propertyId}/mark-boosted`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: payhere_amount,
            reference: formData.get('payment_id') as string,
            paymentMethod: formData.get('method') as string || 'PayHere Sandbox',
            status: status_code === '2' ? 'Completed' : 'Pending',
          })
        });

        if (!boostResponse.ok) {
          console.error(`Failed to boost property ${propertyId} in backend`);
          // Still return 200 to PayHere so they don't retry unnecessarily
        } else {
          console.log(`Successfully boosted property ${propertyId}`);
        }
      }
    }

    // Return clean 200 OK to PayHere
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Error handling PayHere webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
