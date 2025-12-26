import connectToDatabase from '@/lib/db';
import { Idea, IdeaRevision, IdeaLink } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const idea = await Idea.findById(params.id).populate('authorId', 'name');
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    return NextResponse.json(idea);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const idea = await Idea.findById(params.id);

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const { content, changeNote, summary, ...metadata } = body;
    
    // Check if content changed
    const contentChanged = content !== undefined && content !== idea.content;

    // Update metadata directly
    Object.assign(idea, metadata);
    if (content !== undefined) idea.content = content;

    await idea.save();

    if (contentChanged) {
      await IdeaRevision.create({
        ideaId: idea._id,
        contentMd: content,
        summary: summary || 'Update',
        changeNote: changeNote || 'Content updated',
        authorId: idea.authorId, // In real app, current user
      });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    await Idea.findByIdAndDelete(params.id);
    // clean up revisions and links...
    await IdeaRevision.deleteMany({ ideaId: params.id });
    await IdeaLink.deleteMany({ $or: [{ fromIdeaId: params.id }, { toIdeaId: params.id }] });

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
