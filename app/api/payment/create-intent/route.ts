import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';
import { Order } from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// Create Payment Intent
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { bookingData, calculatedAmounts } = body;
    
    const { 
      packageId,
      packageName,
      name, 
      email, 
      phone, 
      date, 
      startTime,
      bookingHours,
      adults,
      children,
      infants,
      package: packageType, 
      guests, 
      specialRequests 
    } = bookingData;

    // Basic validation
    if (!name || !email || !phone || !date || !packageType || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate amounts (use provided amounts if available, otherwise use default calculation)
    let subtotal, vat, totalAmount, vatPercentage;
    
    if (calculatedAmounts) {
      subtotal = calculatedAmounts.subtotal;
      vat = calculatedAmounts.vat;
      totalAmount = calculatedAmounts.total;
      vatPercentage = calculatedAmounts.vatPercentage || 5;
    } else {
      // Default calculation for backward compatibility
      const packagePrices: { [key: string]: number } = {
        shared: 250,
        premium: 450,
        vip: 750,
        buyout: 5000,
        custom: 500, // Default for custom packages
      };

      subtotal = (packagePrices[packageType] || 500) * guests;
      vatPercentage = 5;
      vat = Math.round(subtotal * (vatPercentage / 100));
      totalAmount = subtotal + vat;
    }

    // Create booking first
    const bookingPayload: any = {
      name,
      email,
      phone,
      date: new Date(date),
      package: packageType,
      guests,
      specialRequests,
      subtotal,
      vat,
      vatPercentage,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    };

    // Add optional fields if provided
    if (packageId) bookingPayload.packageId = packageId;
    if (packageName) bookingPayload.packageName = packageName;
    if (startTime) bookingPayload.startTime = startTime;
    if (bookingHours) bookingPayload.bookingHours = bookingHours;
    if (adults !== undefined) bookingPayload.adults = adults;
    if (children !== undefined) bookingPayload.children = children;
    if (infants !== undefined) bookingPayload.infants = infants;

    const booking = await Booking.create(bookingPayload);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to fils (Stripe uses smallest currency unit)
      currency: 'aed',
      metadata: {
        bookingId: booking._id.toString(),
        customerName: name,
        customerEmail: email,
        packageType,
        guests: guests.toString(),
      },
      description: `Yacht Cruise Booking - ${packageType} package for ${guests} guests`,
      receipt_email: email,
    });

    // Generate order number
    const orderNumber = 'ORD-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 10000);

    // Create order
    const order = await Order.create({
      orderNumber,
      bookingId: booking._id,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      packageName: packageName || packageType,
      packageType,
      bookingDate: new Date(date),
      numberOfGuests: guests,
      specialRequests,
      subtotal,
      vat,
      vatPercentage,
      totalAmount,
      currency: 'AED',
      stripePaymentIntentId: paymentIntent.id,
      stripePaymentStatus: 'pending',
      orderStatus: 'pending',
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      orderNumber: order.orderNumber,
      bookingId: booking._id,
      totalAmount,
      subtotal,
      vat,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}
