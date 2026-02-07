import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { FAQ } from '@/models/FAQ';

export async function GET() {
  try {
    await connectDB();

    const faqs = await FAQ.find({ active: true }).sort({ order: 1 });

    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    console.error('Fetch FAQs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const faq = await FAQ.create(body);

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error: any) {
    console.error('Create FAQ error:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ', details: error.message },
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
      return NextResponse.json({ error: 'FAQ ID required' }, { status: 400 });
    }

    const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    console.error('Update FAQ error:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID required' }, { status: 400 });
    }

    await FAQ.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'FAQ deleted' });
  } catch (error: any) {
    console.error('Delete FAQ error:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ', details: error.message },
      { status: 500 }
    );
  }
}
