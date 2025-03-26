import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  catchError,
  finalize,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);

  readonly currentUser$ = user(this.auth);
  readonly isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, () => {
      this.isLoadingSubject.next(false);
    });
  }

  register(email: string, password: string, displayName: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password),
    ).pipe(
      switchMap((credentials) => {
        if (!credentials.user) return of(null);
        return this.handleUserLogin(credentials.user, displayName);
      }),
    );
  }

  login(email: string, password: string) {
    this.isLoadingSubject.next(true);
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  loginWithGoogle() {
    this.isLoadingSubject.next(true);
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(async (credential) => {
        if (!credential.user) return null;
        return this.handleUserLogin(credential.user);
      }),
      catchError((error) => {
        console.error('Error en inicio de sesión', error);
        return of(null);
      }),
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  logout() {
    return from(signOut(this.auth));
  }

  private async handleUserLogin(
    firebaseUser: FirebaseUser,
    displayName?: string,
  ): Promise<User> {
    const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    const userSnap = await getDoc(userRef);

    const userData: User = {
      id: firebaseUser.uid,
      displayName:
        displayName || firebaseUser.displayName || this.generateName(),
      // email: firebaseUser.email || '',
      online: true,
      photoURL: firebaseUser.photoURL || '',
      createdAt: userSnap.exists()
        ? (userSnap.data() as User).createdAt
        : new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(userRef, userData, { merge: true });

    return userData;
  }

  private generateName() {
    const randomNumber = Math.floor(Math.random() * 100000);

    return `Usuario${randomNumber}`;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) return of(null);

        const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
        return from(getDoc(userRef)).pipe(
          map((userSnap) =>
            userSnap.exists()
              ? ({
                  ...userSnap.data(),
                  id: userSnap.id,
                } as User)
              : null,
          ),
        );
      }),
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => !!user));
  }
}
