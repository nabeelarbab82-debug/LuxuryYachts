import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Package } from '@/models/Package';

export async function GET() {
  try {
    await connectDB();

    const packages = await Package.find({ active: true }).sort({ order: 1 });

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    
    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const package_ = await Package.create(body);

    return NextResponse.json(
      { success: true, package: package_ },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Failed to create package', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    // Update slug if name is being updated
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const package_ = await Package.findByIdAndUpdate(id, updateData, { new: true });

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: package_ });
  } catch (error: any) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { error: 'Failed to update package', details: error.message },
      { status: 500 }
    );
  }
}
