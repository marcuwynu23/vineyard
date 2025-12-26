'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LinkIdeaForm({ fromIdeaId }: { fromIdeaId: string }) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [toIdeaId, setToIdeaId] = useState('');
  const [type, setType] = useState('inspired_by');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => setIdeas(data.filter((i: any) => i._id !== fromIdeaId)));
  }, [fromIdeaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toIdeaId) return;
    setLoading(true);

    try {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromIdeaId, toIdeaId, type }),
      });
      router.refresh();
      setToIdeaId('');
    } catch (e) {
      alert('Failed to link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gitlab-gray-100">
      <h4 className="text-sm font-medium text-gitlab-gray-900 mb-2">Connect Idea</h4>
      <div className="space-y-3">
        <select value={toIdeaId} onChange={(e) => setToIdeaId(e.target.value)} className="select text-sm" required>
          <option value="">Select idea...</option>
          {ideas.map(i => (
            <option key={i._id} value={i._id}>{i.title}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="select text-sm">
          <option value="inspired_by">Inspired By</option>
          <option value="derived_from">Derived From</option>
          <option value="merged_into">Merged Into</option>
          <option value="contradicts">Contradicts</option>
        </select>
        <button type="submit" className="btn btn-primary w-full justify-center text-sm" disabled={loading}>
          {loading ? 'Linking...' : 'Add Link'}
        </button>
      </div>
    </form>
  );
}
