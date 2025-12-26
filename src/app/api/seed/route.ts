import connectToDatabase from '@/lib/db';
import { Idea, IdeaLink, IdeaRevision, Tag, User } from '@/lib/models';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await User.deleteMany({});
    await Idea.deleteMany({});
    await Tag.deleteMany({});
    await IdeaLink.deleteMany({});
    await IdeaRevision.deleteMany({});

    // Create Users
    const admin = await User.create({ name: 'Admin User', email: 'admin@vineyard.dev', role: 'admin' });
    const dev = await User.create({ name: 'Dev User', email: 'dev@vineyard.dev', role: 'dev' });

    // Create Tags
    const tags = ['architecture', 'frontend', 'database', 'ux', 'random'].map(name => ({ name }));
    const createdTags = await Tag.insertMany(tags);

    // Create Ideas
    const idea1 = await Idea.create({
      title: 'Vineyard: Initial Concept',
      status: 'brewing',
      confidence: 'high',
      visibility: 'public',
      tags: ['architecture', 'frontend'],
      authorId: admin._id,
      content: '# Vineyard\n\nA system to manage ideas efficiently.',
    });

    const idea2 = await Idea.create({
      title: 'Graph Visualization for Ideas',
      status: 'seed',
      confidence: 'medium',
      visibility: 'public',
      tags: ['ux', 'frontend'],
      authorId: dev._id,
      content: 'Using D3 or Cytoscape to visualize how ideas connect.',
    });

    const idea3 = await Idea.create({
      title: 'Switch to Postgres',
      status: 'archived',
      confidence: 'low',
      visibility: 'private',
      tags: ['database'],
      authorId: dev._id,
      content: 'Maybe Mongo is not enough? Nah, it\'s fine.',
    });

    // Create Revisions
    await IdeaRevision.create({
      ideaId: idea1._id,
      contentMd: '# Vineyard\n\nA system to manage ideas.',
      summary: 'Initial draft',
      changeNote: 'Created the first concept',
      authorId: admin._id,
    });
    
    await IdeaRevision.create({
      ideaId: idea1._id,
      contentMd: '# Vineyard\n\nA system to manage ideas efficiently.',
      summary: 'Updated description',
      changeNote: 'Added "efficiently"',
      authorId: admin._id,
    });

    // Create Links
    await IdeaLink.create({
      fromIdeaId: idea2._id,
      toIdeaId: idea1._id,
      type: 'derived_from',
    });

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
