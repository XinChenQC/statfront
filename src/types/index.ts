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
  last_signin:string;
  organization: string;
  frequency: string;
  // Add other user fields as needed
}

export interface Task {
  id: number;
  user_id: string;
  user_email: string;
  created_at: string;
  description: string;
  token_used: number;
  status: string;
  // Add other task fields as needed
}

export interface ApiResponse<T> {
  data: T[];
  message: string;
  status: 'success' | 'error';
}

export interface WorkflowRequest {
  password: string;
  task_id: string;
}

export interface WorkflowResponse {
  workflow: Record<string, any>;
  message: string;
  status: string;
}