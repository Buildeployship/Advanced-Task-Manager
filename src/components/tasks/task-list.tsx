'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Task } from '@/lib/types';
import TaskItem from './task-item';
import TaskForm from './task-form';
import { Button } from '@/components/ui/button';
// ...existing code...

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const supabase = createClient();





  // useEffect for filtering tasks

  // fetchTasks must be declared before useEffect that uses it
  const fetchTasks = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // useEffect for fetching tasks and subscribing to changes
  useEffect(() => {
    fetchTasks();
    
    const channel = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks, supabase]);

  // Removed obsolete filtering useEffect



  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleFormCancel = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  // Removed unused stats variables

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kanban columns
  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'inprogress', title: 'In Progress' },
    { key: 'done', title: 'Done' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
            <p className="mt-2 text-gray-600">Drag and drop tasks between columns</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTask(null)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TaskForm
                  task={editingTask === null ? undefined : editingTask}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {columns.map((col) => (
            <div key={col.key} className="flex-1 min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">{col.title}</h2>
              <div className="flex-1 space-y-4">
                {tasks.filter(task => task.status === col.key).length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No tasks</div>
                ) : (
                  tasks.filter(task => task.status === col.key).map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
