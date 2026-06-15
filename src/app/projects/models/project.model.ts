export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface Project {
  id: number | null;
  name: string;
  startDate: string; // ISO date string: YYYY-MM-DD
  endDate: string;   // ISO date string: YYYY-MM-DD
  status: ProjectStatus;
  description: string;
}

export interface ProjectCreateRequest {
  id: null;
  name: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description: string;
}
