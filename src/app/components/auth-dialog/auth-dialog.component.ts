import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDividerModule,
    MatTabsModule,
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss',
  standalone: true,
})
export class LoginDialogComponent implements OnInit {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  tabIndex = signal(0);

  authService = inject(AuthService);
  dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.dialogRef.close();
      }
    });
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  async loginWithEmail() {
    if (this.loginForm.valid) {
      const error = await this.authService.loginWithEmail(
        this.loginForm.value.email!,
        this.loginForm.value.password!,
      );
      if (error) {
        this.passwordLogin.setErrors(error);
      }
    }
  }

  async registerWithEmail() {
    if (this.registerForm.valid) {
      await this.authService.registerWithEmail(
        this.registerForm.value.email!,
        this.registerForm.value.password!,
        this.registerForm.value.username!,
      );
    }
  }

  get loading() {
    return this.authService.loading;
  }

  validateEmail(email: AbstractControl) {
    return email.hasError('required')
      ? 'El campo email es requerido'
      : email.hasError('email')
        ? 'El email no es válido'
        : '';
  }

  validatePassword(password: AbstractControl) {
    return password.hasError('required')
      ? 'El campo contraseña es requerido'
      : password.hasError('minlength')
        ? 'La contraseña debe tener al menos 6 caracteres'
        : password.hasError('invalidLogin')
          ? 'El email o la contraseña son incorrectos'
          : password.hasError('userDisabled')
            ? 'El usuario está deshabilitado'
            : password.hasError('userDeleted')
              ? 'El usuario no existe'
              : password.hasError('emailExists')
                ? 'El email ya existe'
                : 'Error desconocido';
  }

  get emailLogin() {
    return this.loginForm.get('email')!;
  }
  get emailLoginError() {
    return this.validateEmail(this.emailLogin);
  }

  get passwordLogin() {
    return this.loginForm.get('password')!;
  }

  get passwordLoginError() {
    return this.validatePassword(this.passwordLogin);
  }

  get usernameRegister() {
    return this.registerForm.get('username')!;
  }
  get usernameRegisterError() {
    return this.usernameRegister.hasError('required')
      ? 'El campo nombre de usuario es requerido'
      : this.usernameRegister.hasError('minlength')
        ? 'El nombre de usuario debe tener al menos 3 caracteres'
        : '';
  }

  get emailRegister() {
    return this.registerForm.get('email')!;
  }
  get passwordRegister() {
    return this.registerForm.get('password')!;
  }
  get emailRegisterError() {
    return this.validateEmail(this.emailRegister);
  }
  get passwordRegisterError() {
    return this.validatePassword(this.passwordRegister);
  }
}
