import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin', details: error.message },
      { status: 500 }
    );
  }
}
