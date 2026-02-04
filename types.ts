
export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

export interface ThinkingPlan {
  thought: string;
  action: string;
  timestamp: string;
}

export interface TerminalLog {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'ai';
  timestamp: string;
}
