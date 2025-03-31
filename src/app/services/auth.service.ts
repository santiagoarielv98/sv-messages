import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private provider: GoogleAuthProvider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);

  user$ = user(this.auth).pipe(shareReplay(1));

  async login() {
    await signInWithPopup(this.auth, this.provider);
  }

  async logout() {
    await signOut(this.auth);
  }
}
