import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { IdeaLink } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const links = await IdeaLink.find({}).populate('fromIdeaId', 'title').populate('toIdeaId', 'title');
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const link = await IdeaLink.create(body);
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
