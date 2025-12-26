import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

interface IdeaProps {
  idea: any; 
}

const statusStyles: any = {
  seed: 'bg-gray-100 text-gray-700 border-gray-200',
  brewing: 'bg-orange-50 text-orange-700 border-orange-200',
  prototyped: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200 line-through',
};

export default function IdeaCard({ idea }: IdeaProps) {
  return (
    <Link href={`/ideas/${idea._id}`} className="group block h-full">
      <div className="bg-white border border-gitlab-gray-200 rounded p-4 h-full flex flex-col hover:border-gitlab-blue-500 hover:shadow-sm transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-bold text-gitlab-gray-900 group-hover:text-gitlab-blue-600 line-clamp-1" title={idea.title}>
            {idea.title}
          </h3>
          <span className={clsx("text-xs px-2 py-0.5 rounded-full border border-transparent font-medium", statusStyles[idea.status] || statusStyles.seed)}>
            {idea.status}
          </span>
        </div>
        
        <p className="text-sm text-gitlab-gray-500 mb-4 line-clamp-3 leading-relaxed flex-1">
          {idea.content ? idea.content.replace(/[#*`]/g, '').substring(0, 150) : 'No content...'}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gitlab-gray-100">
          <div className="flex gap-1.5 flex-wrap">
            {idea.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-gitlab-gray-100 text-gitlab-gray-500 px-1.5 py-0.5 rounded border border-gitlab-gray-200">
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(idea.updatedAt))} ago
          </span>
        </div>
      </div>
    </Link>
  );
}
