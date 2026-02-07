import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Content } from '@/models/Content';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const section = searchParams.get('section');

    if (section) {
      const content = await Content.findOne({ section });
      return NextResponse.json({ success: true, content });
    }

    const contents = await Content.find({});
    return NextResponse.json({ success: true, contents });
  } catch (error: any) {
    console.error('Fetch content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    
    // Upsert: update if exists, create if not
    const content = await Content.findOneAndUpdate(
      { section: body.section },
      { ...body, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, content }, { status: 201 });
  } catch (error: any) {
    console.error('Save content error:', error);
    return NextResponse.json(
      { error: 'Failed to save content', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json({ error: 'Section required' }, { status: 400 });
    }

    await Content.findOneAndDelete({ section });

    return NextResponse.json({ success: true, message: 'Content deleted' });
  } catch (error: any) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content', details: error.message },
      { status: 500 }
    );
  }
}
