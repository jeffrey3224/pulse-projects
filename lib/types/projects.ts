export interface Step {
  id: number;
  title: string;
  completed: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate?: string;
  steps: Step[]
}