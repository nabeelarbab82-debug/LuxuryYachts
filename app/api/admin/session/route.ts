import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: session.user,
      authenticated: true 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
