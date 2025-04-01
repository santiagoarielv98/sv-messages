import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  private auth: Auth = inject(Auth);
  private provider: GoogleAuthProvider = new GoogleAuthProvider();

  constructor() {
    this.user$ = user(this.auth).pipe(shareReplay(1));
  }

  async login(): Promise<User> {
    try {
      const credential = await signInWithPopup(this.auth, this.provider);
      return credential.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
