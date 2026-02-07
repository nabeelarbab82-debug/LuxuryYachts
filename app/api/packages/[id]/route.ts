import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Package } from '@/models/Package';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const package_ = await Package.findById(params.id);

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: package_ });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch package', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    // Update slug if name is being updated
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const package_ = await Package.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: package_ });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update package', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const package_ = await Package.findByIdAndDelete(params.id);

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Package deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete package', details: error.message },
      { status: 500 }
    );
  }
}
