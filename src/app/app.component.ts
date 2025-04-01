import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  private authService = inject(AuthService);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.authService.currentUser$;
  error$ = this.errorSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  loginWithGoogle(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        console.log('Successfully logged in with Google');
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to login with Google');
        console.error('Login error:', err);
      },
    });
  }

  logout(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.authService.logout().subscribe({
      next: () => {
        console.log('Successfully logged out');
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to logout');
        console.error('Logout error:', err);
      },
    });
  }
}
