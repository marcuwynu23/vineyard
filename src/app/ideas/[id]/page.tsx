import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import { Idea } from '@/lib/models';
import MarkdownView from '@/components/MarkdownView';
import RevisionsList from '@/components/RevisionsList';
import LinkIdeaForm from '@/components/LinkIdeaForm';
import { formatDistanceToNow } from 'date-fns';
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

export default async function IdeaPage({ params }: { params: { id: string } }) {
  const idea = await getIdea(params.id);

  if (!idea) return notFound();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold text-gitlab-gray-900 mb-2">{idea.title}</h1>
             <div className="flex gap-2 flex-wrap">
               {idea.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-gitlab-gray-100 text-gitlab-gray-600 border border-gitlab-gray-200 text-sm font-medium">
                    #{tag}
                  </span>
               ))}
             </div>
           </div>
           <div className="flex gap-2">
             <Link href={`/ideas/${idea._id}/edit`} className="btn btn-secondary whitespace-nowrap">
               Edit Idea
             </Link>
             <DeleteButton id={idea._id} />
           </div>
        </div>

        <div className="bg-white border border-gitlab-gray-200 rounded p-8 shadow-sm markdown">
          <MarkdownView content={idea.content} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        
        {/* Metadata */}
        <div className="bg-white border border-gitlab-gray-200 rounded p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gitlab-gray-900 uppercase tracking-wide border-b border-gitlab-gray-100 pb-2 mb-3">Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gitlab-gray-500">Status</span>
              <span className="font-bold text-gitlab-gray-900 capitalize">{idea.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gitlab-gray-500">Confidence</span>
              <span className="font-bold text-gitlab-gray-900 capitalize">{idea.confidence}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gitlab-gray-500">Visibility</span>
              <span className="font-bold text-gitlab-gray-900 capitalize">{idea.visibility}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gitlab-gray-500">Author</span>
              <span className="text-gitlab-gray-900">{idea.authorId?.name}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-gitlab-gray-500">Updated</span>
               <span className="text-gitlab-gray-900">{formatDistanceToNow(new Date(idea.updatedAt))} ago</span>
            </div>
          </div>
        </div>

        {/* Revisions */}
        <div className="bg-white border border-gitlab-gray-200 rounded p-4 shadow-sm">
           <h3 className="text-sm font-bold text-gitlab-gray-900 uppercase tracking-wide border-b border-gitlab-gray-100 pb-2 mb-3">History</h3>
           <RevisionsList ideaId={idea._id} />
        </div>

        {/* Connections */}
        <div className="bg-white border border-gitlab-gray-200 rounded p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gitlab-gray-900 uppercase tracking-wide border-b border-gitlab-gray-100 pb-2 mb-3">Connections</h3>
          <div className="mb-4">
             <Link href="/graph" className="text-gitlab-blue-600 hover:text-gitlab-blue-700 text-sm font-medium flex items-center gap-1">
               View full graph 
               <span aria-hidden="true">&rarr;</span>
             </Link>
          </div>
          <LinkIdeaForm fromIdeaId={idea._id} />
        </div>

      </div>
    </div>
  );
}
