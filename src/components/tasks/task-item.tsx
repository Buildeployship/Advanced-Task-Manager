'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';

import { Edit, Trash2, Calendar, AlertCircle, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
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

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
  const isDueSoon = task.due_date && 
    new Date(task.due_date) > new Date() && 
    new Date(task.due_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && 
    !task.completed;

  return (
    <div className={`bg-white border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
      task.completed 
        ? 'border-gray-200 bg-gray-50' 
        : isOverdue 
        ? 'border-red-200 bg-red-50' 
        : isDueSoon 
        ? 'border-yellow-200 bg-yellow-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={toggleComplete}
            disabled={loading}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            {task.completed && <CheckCircle2 className="w-3 h-3 mx-auto" />}
          </button>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`mt-1 text-sm ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  {task.due_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
              
              {/* Badges and Actions */}
              <div className="flex items-start space-x-2 ml-4">
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-1">
                    <Badge variant={getPriorityVariant(task.priority)} className="capitalize text-xs">
                      {task.priority}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="destructive" className="flex items-center space-x-1 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>Overdue</span>
                      </Badge>
                    )}
                    {isDueSoon && (
                      <Badge className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Due Soon</span>
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowActions(!showActions)}
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    
                    {showActions && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onEdit(task);
                              setShowActions(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete(task.id);
                              setShowActions(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}
