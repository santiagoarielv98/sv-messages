import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../domain/entities/user';
import { AuthRepository } from '../../domain/repositories/auth.repository';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InMemoryAuthRepository extends AuthRepository {
  private currentUser = new BehaviorSubject<User | null>(null);

  override getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  override async signIn(email?: string, password?: string): Promise<void> {
    if (email === 'demo@example.com' && password === 'password') {
      this.currentUser.next({
        displayName: 'demo',
        email: 'demo@example.com',
        photoURL: 'https://placehold.co/100x100',
        uid: 'demo',
      });
    } else {
      this.currentUser.next(null);
    }
  }
  override async signOut(): Promise<void> {
    this.currentUser.next(null);
  }
}
