import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-dialog',
  imports: [
    AsyncPipe,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTabsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
})
export class AuthDialogComponent {
  private readonly authService = inject(AuthService);
  loading$ = this.authService.isLoading$;

  loginForm: FormGroup;
  registerForm: FormGroup;
  hidePassword = true;

  onLogin() {
    if (this.loginForm.valid) {
      // Login logic will be implemented later
      console.log(this.loginForm.value);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      // Registration logic will be implemented later
      console.log(this.registerForm.value);
    }
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (user) => {
        if (user) {
          console.log('User logged in with Google:', user);
        } else {
          console.error('User not found');
        }
      },
      error: (error) => {
        console.error('Error logging in with Google:', error);
      },
    });
  }
}
