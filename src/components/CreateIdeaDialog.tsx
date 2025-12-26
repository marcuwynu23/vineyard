'use client';

import IdeaForm from '@/components/IdeaForm';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CreateIdeaDialogProps {
  trigger?: React.ReactNode;
}

export default function CreateIdeaDialog({ trigger }: CreateIdeaDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = (idea: any) => {
    setIsOpen(false);
    // Optionally navigate to it, or just refresh list.
    // User probably wants to see it? Let's go to it.
    router.push(`/ideas/${idea._id}`);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button 
            className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-300 hover:text-white hover:bg-white/5"
          >
            New Idea
          </button>
        )}
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Idea">
          <IdeaForm onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
