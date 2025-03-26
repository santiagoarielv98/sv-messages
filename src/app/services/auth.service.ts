import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  user,
  User as FirebaseUser,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { catchError, from, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  readonly currentUser$ = user(this.auth);

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
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithGoogle() {
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
}
