export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string;
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  image?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  password?: string;
  image?: string;
}

export interface ApiErrorBody {
  error: string;
}
