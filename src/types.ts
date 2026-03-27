export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

export type NavItem = 'home' | 'tasks' | 'stats' | 'profile';
