import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navigation from '@/components/navigation';
import TaskList from '@/components/tasks/task-list';

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      <main className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <TaskList />
      </main>
    </div>
  );
}
