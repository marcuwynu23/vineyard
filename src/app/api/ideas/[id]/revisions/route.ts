import connectToDatabase from '@/lib/db';
import { IdeaRevision } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const revisions = await IdeaRevision.find({ ideaId: params.id })
      .sort({ createdAt: -1 })
      .populate('authorId', 'name');
    
    return NextResponse.json(revisions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}
