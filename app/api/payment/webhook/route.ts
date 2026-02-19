import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Booking } from '@/models/Booking';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        await handleRefund(refund);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
  
  if (order) {
    order.stripePaymentStatus = 'succeeded';
    order.orderStatus = 'confirmed';
    order.stripeChargeId = paymentIntent.latest_charge as string;
    order.paymentMethod = paymentIntent.payment_method_types[0];
    order.paidAt = new Date();
    await order.save();

    // Update booking
    await Booking.findByIdAndUpdate(order.bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
    });
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
  
  if (order) {
    order.stripePaymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    await order.save();

    // Update booking
    await Booking.findByIdAndUpdate(order.bookingId, {
      status: 'cancelled',
      paymentStatus: 'failed',
    });
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const order = await Order.findOne({ stripeChargeId: charge.id });
  
  if (order) {
    order.stripePaymentStatus = 'refunded';
    order.orderStatus = 'refunded';
    order.refundedAt = new Date();
    await order.save();

    // Update booking
    await Booking.findByIdAndUpdate(order.bookingId, {
      status: 'cancelled',
      paymentStatus: 'refunded',
    });
  }
}
