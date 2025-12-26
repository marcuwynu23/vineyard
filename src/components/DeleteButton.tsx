'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      router.refresh();
      router.push('/');
    } catch (e) {
      alert('Failed to delete');
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsConfirmOpen(true)} 
        disabled={loading}
        className="btn btn-danger"
      >
        Delete Idea
      </button>

      {isConfirmOpen && (
        <Modal 
          isOpen={isConfirmOpen} 
          onClose={() => setIsConfirmOpen(false)} 
          title="Delete Idea ?"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    This action is <span className="font-bold">permanent</span> and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              You are about to delete this idea. This will also remove:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
              <li>All revision history (versions of this idea)</li>
              <li>Links to other ideas (connections)</li>
            </ul>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
