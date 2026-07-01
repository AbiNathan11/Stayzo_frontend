import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { propertyId, amount, currency, orderPrefix } = await req.json();

    if (!propertyId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1236075';
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'MTU3MTgyNzQ1NDkzMjIxOTk2MTEwMTExMTI3NjQyOTc4OTk2MDY4';
    
    // Generate a unique order ID
    const prefix = orderPrefix || 'BOOST';
    const orderId = `${prefix}_${propertyId}_${Date.now()}`;

    // Format amount to 2 decimal places as required by PayHere
    const formattedAmount = parseFloat(amount).toFixed(2);

    // PayHere Hash Generation Logic:
    // strtoupper(md5(merchant_id + order_id + amount_formatted + currency + strtoupper(md5(merchant_secret))))
    
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    return NextResponse.json({
      hash,
      orderId,
      merchantId,
      amount: formattedAmount,
      currency
    });
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
