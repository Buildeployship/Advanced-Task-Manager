'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'} ${isOverdue ? 'border-red-200' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleComplete}
          disabled={loading}
          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due: {formatDate(task.due_date)}</span>
              </div>
            )}
            <span>Created: {formatDate(task.created_at)}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={loading}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
