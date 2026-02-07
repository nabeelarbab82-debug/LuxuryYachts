import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Package } from '@/models/Package';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const package_ = await Package.findOne({ slug: params.slug, active: true });

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
