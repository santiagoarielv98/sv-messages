import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../domain/auth.repository';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { UserEntity } from '../domain/user.entity';
import { from, map, Observable } from 'rxjs';
import { FirebaseUserMapper } from './firebase-user.mapper';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService extends AuthRepository {
  private auth = inject(Auth);
  private user$ = user(this.auth);

  override getCurrentUser(): Observable<UserEntity | null> {
    return this.user$.pipe(
      map<User | null, UserEntity | null>((user) =>
        FirebaseUserMapper.toDomain(user),
      ),
    );
  }
  override loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Observable<UserEntity> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((user) => FirebaseUserMapper.fromCredentialToEntity(user)),
    );
  }

  override loginWithGoogle(): Observable<UserEntity> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      map((user) => FirebaseUserMapper.fromCredentialToEntity(user)),
    );
  }

  override logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  override registerWithEmailAndPassword(
    email: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _displayNames: string,
  ): Observable<UserEntity> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(map((user) => FirebaseUserMapper.fromCredentialToEntity(user)));
  }
}
