// login.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/models/app.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  // Inyección del servicio
  private authService = inject(AuthService);

  // Señales para el estado del componente
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  private loginSubscription: Subscription | null = null;
  private logoutSubscription: Subscription | null = null;

  constructor() {
    const userSignal = toSignal(this.authService.currentUser$, {
      initialValue: null,
    });
    effect(() => {
      this.currentUser.set(userSignal());
      if (userSignal()) {
        this.errorMessage.set('');
      }
    });
    effect(() => {
      // Podemos hacer acciones adicionales cuando cambia el usuario
      const user = this.currentUser();
      if (user) {
        console.log('Usuario ha iniciado sesión:', user.displayName);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones si existen
    this.loginSubscription?.unsubscribe();
    this.logoutSubscription?.unsubscribe();
  }

  loginWithGoogle(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.loginSubscription = this.authService
      .loginWithGoogle()
      .pipe(
        tap({
          next: (user) => {
            console.log('Usuario autenticado:', user);
            this.isLoading.set(false);
            // La señal currentUser se actualizará automáticamente gracias al effect en ngOnInit
          },
          error: (error) => {
            console.error('Error al iniciar sesión con Google:', error);
            this.errorMessage.set('Error al iniciar sesión con Google');
            this.isLoading.set(false);
          },
        }),
        catchError((error) => {
          this.errorMessage.set('Error al iniciar sesión con Google');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  logout(): void {
    this.isLoading.set(true);

    this.logoutSubscription = this.authService
      .logout()
      .pipe(
        tap({
          next: () => {
            console.log('Sesión cerrada correctamente');
            this.isLoading.set(false);
            // La señal currentUser se actualizará automáticamente
          },
          error: (error) => {
            console.error('Error al cerrar sesión:', error);
            this.errorMessage.set('Error al cerrar sesión');
            this.isLoading.set(false);
          },
        }),
        catchError((error) => {
          this.errorMessage.set('Error al cerrar sesión');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
