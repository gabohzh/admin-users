import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { User, userApiId } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {
  protected readonly userApiId = userApiId;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  user: User | null = null;
  loading = true;
  errorMsg = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'No se indicó un usuario.';
      this.loading = false;
      return;
    }
    this.usersService.getById(id).subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = this.readApiError(err) || 'No se pudo cargar el usuario.';
        this.loading = false;
      },
    });
  }

  goToEdit(): void {
    if (!this.user) {
      return;
    }
    void this.router.navigate(['/updateuser', userApiId(this.user)], { state: { user: this.user } });
  }

  onDelete(): void {
    if (!this.user) {
      return;
    }
    const label = `${this.user.first_name} ${this.user.last_name}`.trim();
    if (!window.confirm(`¿Seguro que quieres eliminar al usuario ${label}?`)) {
      return;
    }
    this.usersService.delete(userApiId(this.user)).subscribe({
      next: () => {
        window.alert('Solicitud enviada correctamente.');
        void this.router.navigate(['/home']);
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
