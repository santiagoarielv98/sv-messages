import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  UserCredential,
} from '@angular/fire/auth';
import {
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/models/app.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private provider = new GoogleAuthProvider();

  readonly user$ = user(this.auth);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initAuthState();
  }

  private initAuthState(): Subscription {
    return authState(this.auth)
      .pipe(
        switchMap((firebaseUser) => {
          if (firebaseUser) {
            return this.getUserData(firebaseUser.uid).pipe(
              catchError((error) => {
                console.error('Error en initAuthState->getUserData:', error);
                this.currentUserSubject.next(null);
                return of(null);
              }),
            );
          } else {
            this.currentUserSubject.next(null);
            return of(null);
          }
        }),
      )
      .subscribe();
  }

  private getUserData(userId: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as Omit<User, 'id'>;
          const user: User = {
            id: docSnap.id,
            ...userData,
          };
          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      }),
    );
  }

  loginWithGoogle(): Observable<User> {
    return from(signInWithPopup(this.auth, this.provider)).pipe(
      switchMap((credential) => this.handleUserCredential(credential)),
      catchError((error) => {
        console.error('Google login error:', error);
        return throwError(() => error);
      }),
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(() => error);
      }),
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  private createUserInFirestore(
    credential: UserCredential,
    displayName: string,
  ): Observable<User> {
    if (!credential.user)
      return throwError(() => new Error('No user in credential'));

    const userId = credential.user.uid;
    const userRef = doc(this.firestore, `users/${userId}`);

    const userData = {
      displayName,
      photoURL: credential.user.photoURL || '',
      online: true,
      lastLoginAt: serverTimestamp(),
    };

    return from(setDoc(userRef, userData)).pipe(
      map(() => {
        const newUser: User = {
          id: userId,
          ...userData,
          lastLoginAt: new Date(),
        };
        this.currentUserSubject.next(newUser);
        return newUser;
      }),
    );
  }

  private handleUserCredential(credential: UserCredential): Observable<User> {
    if (!credential.user)
      return throwError(() => new Error('No user in credential'));

    const userId = credential.user.uid;
    const userRef = doc(this.firestore, `users/${userId}`);

    return from(getDoc(userRef)).pipe(
      switchMap((docSnap) => {
        if (docSnap.exists()) {
          const updateData = {
            online: true,
            lastLoginAt: serverTimestamp(),
          };

          return from(updateDoc(userRef, updateData)).pipe(
            map(() => {
              const userData = docSnap.data() as Omit<User, 'id'>;
              const user: User = {
                id: userId,
                ...userData,
                online: true,
                lastLoginAt: new Date(),
              };
              this.currentUserSubject.next(user);
              return user;
            }),
          );
        } else {
          return this.createUserInFirestore(
            credential,
            credential.user.displayName || 'User',
          );
        }
      }),
    );
  }

  updateOnlineStatus(online: boolean): Observable<void> {
    const user = this.getCurrentUser();
    if (!user) return of(undefined);

    const userRef = doc(this.firestore, `users/${user.id}`);
    return from(updateDoc(userRef, { online }));
  }
}
