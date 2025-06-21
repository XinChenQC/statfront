export interface User {
  id: string;
  username: string;
  email: string;
  country: string;
  created_at: string;
  industry: string;
  vip: boolean;
  expertise: string;
  position: string;
  educator: boolean;
  open_source_contributor: boolean;
  tokens_bought: number;
  tokens_planned: number;
  // Add other user fields as needed
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  // Add other task fields as needed
}

export interface ApiResponse<T> {
  data: T[];
  message: string;
  status: 'success' | 'error';
} 