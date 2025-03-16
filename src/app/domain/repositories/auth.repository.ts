import { Observable } from 'rxjs';
import { User } from '../entities/user';

export abstract class AuthRepository {
  abstract signIn(email?: string, password?: string): Promise<void>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Observable<User | null>;
}
