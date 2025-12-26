import IdeaCard from '@/components/IdeaCard';
import CreateIdeaDialog from '@/components/CreateIdeaDialog';
import connectToDatabase from '@/lib/db';
import { Idea } from '@/lib/models';
import { clsx } from 'clsx';
import Link from 'next/link';

async function getIdeas(searchParams: any) {
  await connectToDatabase();
  const filter: any = {};
  if (searchParams.status) filter.status = searchParams.status;
  if (searchParams.confidence) filter.confidence = searchParams.confidence;
  
  const ideas = await Idea.find(filter).sort({ updatedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(ideas));
}

function FilterButton({ status, current, children }: { status: string, current: string | undefined, children: React.ReactNode }) {
  const isActive = status === 'all' ? !current : current === status;
  const href = status === 'all' ? '/' : `/?status=${status}`;
  
  return (
    <Link 
      href={href} 
      className={clsx(
        "px-3 py-1.5 text-sm font-medium rounded-full transition-colors border",
        isActive 
          ? "bg-gitlab-gray-700 text-white border-gitlab-gray-700" 
          : "bg-white text-gitlab-gray-500 border-gitlab-gray-200 hover:bg-gitlab-gray-100 hover:text-gitlab-gray-700"
      )}
    >
      {children}
    </Link>
  );
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const ideas = await getIdeas(searchParams);

  // We reuse CreateIdeaDialog but styled as a primary button?
  // Actually, CreateIdeaDialog renders a "Navbar Link" style by default.
  // We should make CreateIdeaDialog flexible or create a second trigger.
  // For now, I'll update CreateIdeaDialog to accept a 'variant' or just className override.
  // Or simpler: Just render it in the Navbar and remove it from here? No, 'New Idea' button on dashboard is good.
  // Let's modify CreateIdeaDialog to accept children or just className.
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gitlab-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gitlab-gray-900 mb-1">Idea Garden</h1>
          <p className="text-gitlab-gray-500">Cultivate your best thoughts.</p>
        </div>
        <div>
             <CreateIdeaDialog trigger={
                <button className="btn btn-primary">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  New Idea
                </button>
             } />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterButton status="all" current={searchParams.status as string}>All</FilterButton>
        <FilterButton status="seed" current={searchParams.status as string}>Seed</FilterButton>
        <FilterButton status="brewing" current={searchParams.status as string}>Brewing</FilterButton>
        <FilterButton status="prototyped" current={searchParams.status as string}>Prototyped</FilterButton>
        <FilterButton status="shipped" current={searchParams.status as string}>Shipped</FilterButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea: any) => (
          <IdeaCard key={idea._id} idea={idea} />
        ))}
        {ideas.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded border border-dashed border-gitlab-gray-300 text-gitlab-gray-500">
            <div className="w-12 h-12 mx-auto bg-gitlab-gray-100 rounded-full flex items-center justify-center mb-3 text-2xl">
              🌱
            </div>
            <p>No ideas found with this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
