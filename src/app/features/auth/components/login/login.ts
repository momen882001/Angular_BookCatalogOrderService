import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../../core/services/notification.service';
import { SuccessMessages } from '../../../../core/constants/successMessages';

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
export class Login implements OnInit {
  readonly hidePassword = signal(true);
  readonly submitAttempted = signal(false);
  readonly formError = signal<string | null>(null);
  returnUrl: string = '/dashboard/books';

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard/books';
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      username: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),
    });
  }

  protected readonly passwordType = computed(() => (this.hidePassword() ? 'password' : 'text'));

  protected readonly passwordToggleIcon = computed(() =>
    this.hidePassword() ? 'visibility_off' : 'visibility',
  );

  protected readonly passwordToggleLabel = computed(() =>
    this.hidePassword() ? 'Show password' : 'Hide password',
  );

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected onSubmit(): void {
    this.submitAttempted.set(true);
    this.formError.set(null);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.notification.success(SuccessMessages.login);
          this.storageService.setItem('userData', res);
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        console.log('err', err);

        // this.formError.set('Invalid username or password.');
      },
    });
  }

  //* Error handling methods *//
  protected usernameError(): string | null {
    const control = this.loginForm.controls['username'];
    if (!(control.touched || this.submitAttempted()) || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Username is required';
    }
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return 'Username must be between 3 and 50 characters';
    }
    return null;
  }

  protected passwordError(): string | null {
    const control = this.loginForm.controls['password'];
    if (!(control.touched || this.submitAttempted()) || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Password is required';
    }
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return 'Password must be between 8 and 100 characters';
    }
    return null;
  }
}
