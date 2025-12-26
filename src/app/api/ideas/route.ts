import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Idea, IdeaRevision, User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const confidence = searchParams.get('confidence');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    const filter: any = {};
    if (status) filter.status = status;
    if (confidence) filter.confidence = confidence;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Default to excluding 'archived' unless explicitly asked? 
    // Maybe not, the prompt implies "Filtering ideas by status".
    // I'll show all if no filter.

    const ideas = await Idea.find(filter)
      .populate('authorId', 'name email') // exclude sensitive
      .sort({ updatedAt: -1 });

    return NextResponse.json(ideas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    let authorId = body.authorId;

    if (!authorId) {
      // Logic to find a default user if not provided (Dev Mode convenience)
      const defaultUser = await User.findOne({});
      if (defaultUser) {
        authorId = defaultUser._id;
      } else {
        // Create a default dev user if absolutely no users exist
        const newUser = await User.create({ 
          name: 'Dev User', 
          email: 'dev@vineyard.local', 
          role: 'dev' 
        });
        authorId = newUser._id;
      }
    }
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: 'Missing title' }, { status: 400 });
    }
    
    const idea = await Idea.create({
      title: body.title,
      status: body.status || 'seed',
      confidence: body.confidence || 'low',
      visibility: body.visibility || 'private',
      tags: body.tags || [],
      authorId: authorId,
      content: body.content || '',
    });

    // Create initial revision
    if (body.content) {
      await IdeaRevision.create({
        ideaId: idea._id,
        contentMd: body.content,
        summary: 'Initial creation',
        changeNote: 'First draft',
        authorId: authorId,
      });
    }

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
