import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models/Booking';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, date, package: packageType, guests, specialRequests } = body;

    // Basic validation
    if (!name || !email || !phone || !date || !packageType || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount based on package
    const packagePrices: { [key: string]: number } = {
      shared: 250,
      premium: 450,
      vip: 750,
      buyout: 0, // Contact for pricing
    };

    const totalAmount = packagePrices[packageType] * guests;

    // Create booking
    const booking = await Booking.create({
      name,
      email,
      phone,
      date: new Date(date),
      package: packageType,
      guests,
      specialRequests,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking created successfully',
        bookingId: booking._id,
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');

    const query = status ? { status } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: error.message },
      { status: 500 }
    );
  }
}
