import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '../../domain/entities/user';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthRepository extends AuthRepository {
  private auth = inject(Auth);
  user$ = user(this.auth);

  override getCurrentUser(): Observable<User | null> {
    return this.user$ as Observable<User | null>;
  }
  override async signIn(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  override async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
