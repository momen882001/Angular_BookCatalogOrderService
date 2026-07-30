import { Component, computed, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { UserRoleEnum } from '../../../../shared/enums/UserRoleEnum';
import { NotificationService } from '../../../../core/services/notification.service';
import { SuccessMessages } from '../../../../core/constants/successMessages';

const NAME_PATTERN = /^[a-zA-Z\s'-]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const password = parent.get('password')?.value;
    const confirmPassword = control.value;

    if (!confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly submitAttempted = signal(false);
  readonly formError = signal<string | null>(null);

  signupForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initSingUpForm();

    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private initSingUpForm() {
    this.signupForm = this.fb.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(NAME_PATTERN),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(NAME_PATTERN),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(USERNAME_PATTERN),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, passwordsMatchValidator()]],
    });
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((hidden) => !hidden);
  }

  protected shouldShowErrors(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && (control.touched || this.submitAttempted()) && control.errors);
  }

  protected onSubmit(): void {
    this.submitAttempted.set(true);
    this.formError.set(null);
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    const { firstname, lastname, username, password, email } = this.signupForm.getRawValue();

    this.authService
      .signUp({ firstname, lastname, username, password, role: UserRoleEnum.CUSTOMER, email })
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res) {
            this.router.navigate(['/auth/login']);
            this.notificationService.success(SuccessMessages.userCreated);
          }
        },
        error: (err) => {
          console.log('err', err);
          this.formError.set('Failed to create account. Please try again.');
        },
      });
  }

  //* Error handling methods *//
  protected firstnameError(): string | null {
    const control = this.signupForm.get('firstname');
    if (!this.shouldShowErrors('firstname') || !control?.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'First name is required';
    }
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return 'First name must be between 2 and 50 characters';
    }
    if (control.errors['pattern']) {
      return 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  }

  protected lastnameError(): string | null {
    const control = this.signupForm.get('lastname');
    if (!this.shouldShowErrors('lastname') || !control?.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Last name is required';
    }
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return 'Last name must be between 2 and 50 characters';
    }
    if (control.errors['pattern']) {
      return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  }

  protected usernameError(): string | null {
    const control = this.signupForm.get('username');
    if (!this.shouldShowErrors('username') || !control?.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Username is required';
    }
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return 'Username must be between 3 and 50 characters';
    }
    if (control.errors['pattern']) {
      return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
    }
    return null;
  }

  protected emailError(): string | null {
    const control = this.signupForm.get('email');
    if (!this.shouldShowErrors('email') || !control?.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Email is required';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email (example: name@example.com)';
    }
    return null;
  }

  protected passwordError(): string | null {
    const control = this.signupForm.get('password');
    if (!this.shouldShowErrors('password') || !control?.errors) {
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

  protected confirmPasswordError(): string | null {
    const control = this.signupForm.get('confirmPassword');
    if (!this.shouldShowErrors('confirmPassword') || !control?.errors) {
      return null;
    }
    if (control.errors['required']) {
      return 'Confirm password is required';
    }
    if (control.errors['passwordsMismatch']) {
      return 'Passwords do not match';
    }
    return null;
  }

  //---------------------------------- Related to Password ---------------------------------------------
  protected readonly passwordType = computed(() => (this.hidePassword() ? 'password' : 'text'));

  protected readonly confirmPasswordType = computed(() =>
    this.hideConfirmPassword() ? 'password' : 'text',
  );

  protected readonly passwordToggleIcon = computed(() =>
    this.hidePassword() ? 'visibility_off' : 'visibility',
  );

  protected readonly confirmPasswordToggleIcon = computed(() =>
    this.hideConfirmPassword() ? 'visibility_off' : 'visibility',
  );

  protected readonly passwordToggleLabel = computed(() =>
    this.hidePassword() ? 'Show password' : 'Hide password',
  );

  protected readonly confirmPasswordToggleLabel = computed(() =>
    this.hideConfirmPassword() ? 'Show confirm password' : 'Hide confirm password',
  );
}
