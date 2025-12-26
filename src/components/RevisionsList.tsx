'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function RevisionsList({ ideaId }: { ideaId: string }) {
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/ideas/${ideaId}/revisions`)
      .then(res => res.json())
      .then(setRevisions);
  }, [ideaId]);

  if (revisions.length === 0) return <p className="text-sm text-gitlab-gray-500 italic">No history yet.</p>;

  return (
    <div className="space-y-4">
      {revisions.map((rev) => (
        <div key={rev._id} className="relative pl-4 border-l-2 border-gitlab-gray-200">
          <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gitlab-gray-300"></div>
          <div className="text-sm font-medium text-gitlab-gray-900">
            {rev.summary || 'Update'}
          </div>
          <div className="text-xs text-gitlab-gray-500 mt-0.5">
            <span className="font-medium text-gitlab-gray-700">{rev.authorId?.name || 'Unknown'}</span> • {formatDistanceToNow(new Date(rev.createdAt))} ago
          </div>
          {rev.changeNote && (
            <div className="mt-1 text-xs text-gitlab-gray-600 bg-gitlab-gray-50 p-2 rounded border border-gitlab-gray-100 italic">
               "{rev.changeNote}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
