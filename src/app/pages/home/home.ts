import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly usersService = inject(UsersService);

  users: User[] = [];
  loading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMsg = '';
    this.usersService.getAll(1, 100).subscribe({
      next: (res) => {
        const list = res.results ?? res.data ?? [];
        this.users = Array.isArray(list) ? list : [];
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = this.readApiError(err) || 'No se pudo cargar el listado.';
        this.loading = false;
      },
    });
  }

  onDelete(user: User, event: Event): void {
    event.preventDefault();
    const label = `${user.first_name} ${user.last_name}`.trim();
    if (!window.confirm(`¿Seguro que quieres eliminar al usuario ${label}?`)) {
      return;
    }
    this.usersService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
        window.alert('Solicitud enviada correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        window.alert(this.readApiError(err) || 'No se pudo eliminar el usuario.');
      },
    });
  }

  private readApiError(err: HttpErrorResponse): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error;
    }
    return '';
  }
}
