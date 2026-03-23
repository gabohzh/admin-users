import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UpdateUserRequest, User, userApiId } from '../../models/user';
import { UsersService } from '../../services/users.service';

function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').toString().trim();
  return v.length === 0 ? { required: true } : null;
}

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  readonly form = this.fb.group({
    first_name: ['', noSoloEspacios],
    last_name: ['', noSoloEspacios],
    email: ['', [noSoloEspacios, Validators.email]],
    username: ['', noSoloEspacios],
    password: ['', noSoloEspacios],
    image: ['', [noSoloEspacios, Validators.pattern(/^https?:\/\/.+/i)]],
  });

  isEditMode = false;
  pageTitle = 'Nuevo usuario';
  submitLabel = 'Guardar';
  submitting = false;
  loadError = '';
  editLoading = false;

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!routeId;

    if (this.isEditMode) {
      this.pageTitle = 'Actualizar usuario';
      this.submitLabel = 'Actualizar';
    }

    if (!routeId) {
      return;
    }

    const fromState = this.readUserFromHistoryState();
    if (fromState && userApiId(fromState) === routeId) {
      this.applyUserToForm(fromState);
      return;
    }

    this.loadError = '';
    this.editLoading = true;
    this.usersService.getById(routeId).subscribe({
      next: (u) => {
        this.applyUserToForm(u);
        this.editLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.editLoading = false;
        this.loadError =
          this.readApiError(err) || 'No se pudieron cargar los datos. Vuelve al listado e intenta Actualizar de nuevo.';
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.trimFormValues(this.form.getRawValue());
    this.submitting = true;

    if (!this.isEditMode) {
      this.usersService
        .create({
          first_name: v.first_name,
          last_name: v.last_name,
          email: v.email,
          username: v.username,
          password: v.password,
          image: v.image,
        })
        .subscribe({
          next: () => {
            this.submitting = false;
            window.alert('Usuario creado.');
            void this.router.navigate(['/home']);
          },
          error: (err: HttpErrorResponse) => {
            this.submitting = false;
            window.alert(this.readApiError(err) || 'No se pudo crear el usuario.');
          },
        });
      return;
    }

    const routeId = this.route.snapshot.paramMap.get('id');
    if (!routeId) {
      this.submitting = false;
      return;
    }

    const body: UpdateUserRequest = {
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      username: v.username,
      password: v.password,
      image: v.image,
    };

    this.usersService.update(routeId, body).subscribe({
      next: () => {
        this.submitting = false;
        window.alert('Usuario actualizado.');
        void this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        window.alert(this.readApiError(err) || 'No se pudo actualizar el usuario.');
      },
    });
  }

  private readUserFromHistoryState(): User | undefined {
    const st = history.state as { user?: User };
    return st?.user;
  }

  private applyUserToForm(u: User): void {
    this.form.patchValue({
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      username: u.username,
      password: u.password ?? '',
      image: u.image,
    });
  }

  private trimFormValues(v: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    image: string;
  }) {
    return {
      first_name: v.first_name.trim(),
      last_name: v.last_name.trim(),
      email: v.email.trim(),
      username: v.username.trim(),
      password: v.password.trim(),
      image: v.image.trim(),
    };
  }

  private readApiError(err: HttpErrorResponse): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error;
    }
    return '';
  }
}
