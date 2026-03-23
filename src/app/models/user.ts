export interface User {
  _id?: string;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  image: string;
  password?: string;
}

export function userApiId(u: User): string {
  if (u._id) {
    return u._id;
  }
  return String(u.id);
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results?: User[];
  data?: User[];
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
