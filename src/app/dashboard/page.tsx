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
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TaskList />
      </main>
    </>
  );
}
