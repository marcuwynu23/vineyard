import IdeaForm from '@/components/IdeaForm';

export default function NewIdeaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gitlab-gray-900">New Idea</h1>
      <IdeaForm />
    </div>
  );
}
