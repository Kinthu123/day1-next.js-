import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/database/event.model';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: 'Slug is required' },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ slug });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Event fetched successfully', event }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
