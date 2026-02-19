import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all orders or single order
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('id');

    if (orderId) {
      // Get single order
      const order = await Order.findById(orderId).populate('bookingId');
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    } else {
      // Get all orders
      const status = searchParams.get('status');
      const paymentStatus = searchParams.get('paymentStatus');
      
      const query: any = {};
      if (status) query.orderStatus = status;
      if (paymentStatus) query.stripePaymentStatus = paymentStatus;

      const orders = await Order.find(query)
        .populate('bookingId')
        .sort({ createdAt: -1 })
        .limit(100);

      return NextResponse.json({ success: true, orders });
    }
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}
