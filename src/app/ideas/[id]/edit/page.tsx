import IdeaForm from '@/components/IdeaForm';
import connectToDatabase from '@/lib/db';
import { Idea } from '@/lib/models';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';

async function getIdea(id: string) {
  await connectToDatabase();
  try {
    const idea = await Idea.findById(id).populate('authorId', 'name').lean();
    if (!idea) return null;
    return JSON.parse(JSON.stringify(idea));
  } catch (e) {
    return null;
  }
}

export default async function EditIdeaPage({ params }: { params: { id: string } }) {
  const idea = await getIdea(params.id);

  if (!idea) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/ideas/${idea._id}`} className="text-gitlab-blue-600 hover:text-gitlab-blue-700 font-medium text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Idea
        </Link>
        <h1 className="text-2xl font-bold text-gitlab-gray-900">Edit Idea</h1>
      </div>
      <IdeaForm initialData={idea} isEditing={true} />
      
      <div className="border-t border-gitlab-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-bold text-gitlab-status-danger mb-2">Danger Zone</h3>
        <p className="text-sm text-gitlab-gray-500 mb-4">Deleting an idea cannot be undone.</p>
        <DeleteButton id={idea._id} />
      </div>
    </div>
  );
}
