import { Observable } from 'rxjs';
import { UserEntity } from './user.entity';

export abstract class AuthRepository {
  abstract loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Observable<UserEntity>;
  abstract registerWithEmailAndPassword(
    email: string,
    password: string,
    displayName?: string,
  ): Observable<UserEntity>;
  abstract loginWithGoogle(): Observable<UserEntity>;
  abstract logout(): Observable<void>;
  abstract getCurrentUser(): Observable<UserEntity | null>;
}
