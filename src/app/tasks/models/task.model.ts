export interface TaskRequest {
  project: { id: number };
  title: string;
  estimateHours: number;
  assignee: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface TaskResponse {
  id: number;
  title: string;
  estimateHours: number;
  assignee: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  project?: { id: number };
}
