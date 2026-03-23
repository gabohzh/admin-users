import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersListResponse,
} from '../models/user';

const API_BASE = 'https://peticiones.online/api/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getAll(page?: number, perPage?: number): Observable<UsersListResponse> {
    let params = new HttpParams();
    if (page != null) {
      params = params.set('page', String(page));
    }
    if (perPage != null) {
      params = params.set('per_page', String(perPage));
    }
    return this.http.get<UsersListResponse>(API_BASE, { params });
  }

  getById(id: number | string): Observable<User> {
    return this.http.get<User>(`${API_BASE}/${id}`);
  }

  create(body: CreateUserRequest): Observable<User> {
    return this.http.post<User>(API_BASE, body);
  }

  update(id: number | string, body: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${API_BASE}/${id}`, body);
  }

  delete(id: number | string): Observable<User> {
    return this.http.delete<User>(`${API_BASE}/${id}`);
  }
}
