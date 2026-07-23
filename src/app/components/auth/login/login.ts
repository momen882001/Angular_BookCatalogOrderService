import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly hidePassword = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly loginForm = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  });

  protected readonly passwordType = computed(() =>
    this.hidePassword() ? 'password' : 'text',
  );

  protected readonly passwordToggleIcon = computed(() =>
    this.hidePassword() ? 'visibility_off' : 'visibility',
  );

  protected readonly passwordToggleLabel = computed(() =>
    this.hidePassword() ? 'Show password' : 'Hide password',
  );

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected usernameError(): string | null {
    const control = this.loginForm.controls.username;
    if (!(control.touched || this.submitAttempted()) || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Username is required';
    }
    if (control.errors['minlength']) {
      return 'Username must be at least 3 characters';
    }
    return null;
  }

  protected passwordError(): string | null {
    const control = this.loginForm.controls.password;
    if (!(control.touched || this.submitAttempted()) || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Password is required';
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

  protected onSubmit(): void {
    this.submitAttempted.set(true);
    this.formError.set(null);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    const { username, password } = this.loginForm.getRawValue();

    // Placeholder until auth API is wired
    console.log('Login credentials', { username, password });

    window.setTimeout(() => {
      this.isSubmitting.set(false);
      this.formError.set(
        'Sign-in is not connected yet. Your credentials were validated locally.',
      );
    }, 700);
  }
}
