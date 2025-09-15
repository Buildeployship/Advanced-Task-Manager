export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'todo' | 'inprogress' | 'done';
}

export interface User {
  id: string;
  email: string;
}