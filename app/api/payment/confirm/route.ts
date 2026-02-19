import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Booking } from '@/models/Booking';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, paymentIntentId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    order.stripePaymentStatus = 'succeeded';
    order.orderStatus = 'confirmed';
    order.paidAt = new Date();
    await order.save();

    // Update booking status
    await Booking.findByIdAndUpdate(order.bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed successfully',
      order: {
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment', details: error.message },
      { status: 500 }
    );
  }
}
