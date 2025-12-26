'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface IdeaFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: (newIdea: any) => void;
  onCancel?: () => void;
}

export default function IdeaForm({ initialData = {}, isEditing = false, onSuccess, onCancel }: IdeaFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    status: initialData.status || 'seed',
    confidence: initialData.confidence || 'low',
    visibility: initialData.visibility || 'private',
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    content: initialData.content || '',
    authorId: initialData.authorId?._id || initialData.authorId || '',
    summary: '',
    changeNote: '',
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        if (!formData.authorId && data.length > 0) {
          setFormData(prev => ({ ...prev, authorId: data[0]._id }));
        }
      });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    
    try {
      const url = isEditing ? `/api/ideas/${initialData._id}` : '/api/ideas';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      const saved = await res.json();
      router.refresh();
      
      if (onSuccess) {
        onSuccess(saved);
      } else {
        router.push(`/ideas/${saved._id}`);
      }
    } catch (error) {
      alert('Error saving idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-gitlab-gray-200 rounded p-6 shadow-sm space-y-6">
        
        {/* Header Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Title</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="input w-full" 
              placeholder="Idea Title" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Author (Dev Mode)</label>
            <select name="authorId" value={formData.authorId} onChange={handleChange} className="select w-full">
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status & Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="select w-full">
              <option value="seed">Seed</option>
              <option value="brewing">Brewing</option>
              <option value="prototyped">Prototyped</option>
              <option value="shipped">Shipped</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Confidence</label>
            <select name="confidence" value={formData.confidence} onChange={handleChange} className="select w-full">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Visibility</label>
            <select name="visibility" value={formData.visibility} onChange={handleChange} className="select w-full">
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-gitlab-gray-900 mb-2">Tags (comma sep)</label>
             <input 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange} 
              className="input w-full" 
              placeholder="e.g. ui, api"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex border-b border-gitlab-gray-200 mb-4">
            <button 
              type="button" 
              onClick={() => setActiveTab('write')}
              className={clsx(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'write' 
                  ? "border-gitlab-blue-500 text-gitlab-blue-600" 
                  : "border-transparent text-gitlab-gray-500 hover:text-gitlab-gray-700"
              )}
            >
              Write
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('preview')}
              className={clsx(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'preview' 
                  ? "border-gitlab-blue-500 text-gitlab-blue-600" 
                  : "border-transparent text-gitlab-gray-500 hover:text-gitlab-gray-700"
              )}
            >
              Preview
            </button>
          </div>

          {activeTab === 'write' ? (
             <textarea 
               name="content" 
               value={formData.content} 
               onChange={handleChange} 
               className="textarea block w-full rounded border-gitlab-gray-200 shadow-sm focus:border-gitlab-blue-500 focus:ring-gitlab-blue-500 sm:text-sm p-4 font-mono text-gray-800 bg-gray-50 border h-64 md:h-96" 
               placeholder="# Describe your idea..."
             />
          ) : (
             <div className="markdown bg-white p-6 border border-gitlab-gray-200 rounded min-h-[16rem] md:min-h-[24rem]">
               {formData.content ? (
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content}</ReactMarkdown>
               ) : (
                 <p className="text-gitlab-gray-400 italic">Nothing to preview</p>
               )}
             </div>
          )}
        </div>

        {/* Revision Metadata */}
        {isEditing && (
          <div className="bg-gitlab-gray-50 p-4 rounded border border-gitlab-gray-200">
            <h4 className="text-sm font-bold text-gitlab-gray-900 mb-3">Revision Log</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                className="input w-full" 
                placeholder="What changed? (Summary)"
              />
              <input 
                name="changeNote" 
                value={formData.changeNote} 
                onChange={handleChange} 
                className="input w-full" 
                placeholder="Detailed notes (Optional)"
              />
            </div>
          </div>
        )}

      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn btn-secondary" onClick={() => onCancel ? onCancel() : router.back()}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Idea')}
        </button>
      </div>

    </form>
  );
}
