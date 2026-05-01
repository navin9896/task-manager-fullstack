export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}

