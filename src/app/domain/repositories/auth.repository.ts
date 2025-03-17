import { Observable } from 'rxjs';
import { User } from '../entities/user';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class AuthRepository {
  abstract signIn(email?: string, password?: string): Promise<void>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Observable<User | null>;
}
