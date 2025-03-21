import { inject, Injectable, OnDestroy } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { User } from './chat.service';
import { userCollection } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  auth = inject(Auth);
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, userCollection);
  userSubscription: Subscription;
  loading = false;

  user$ = user(this.auth);

  currentUser: User | null = null;

  constructor() {
    this.userSubscription = this.user$.subscribe((user) => {
      if (user) {
        const userRef = doc(this.firestore, userCollection, user.uid);
        getDoc(userRef).then((userSnap) => {
          if (userSnap.exists()) {
            this.currentUser = userSnap.data() as User;
          } else {
            this.currentUser = null;
          }
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  async loginWithGoogle() {
    this.loading = true;
    const user = await signInWithPopup(this.auth, new GoogleAuthProvider());

    if (user) {
      await this.createUser({
        id: user.user.uid,
        name: user.user.displayName,
      });
    }

    this.loading = false;
  }

  async loginWithEmail(email: string, password: string) {
    this.loading = true;
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      if (user) {
        await this.createUser({
          id: user.user.uid,
          name: user.user.displayName,
        });
      }
    } catch (error) {
      return this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
    return null;
  }
  async registerWithEmail(email: string, password: string, username: string) {
    this.loading = true;
    try {
      const createUser = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      if (createUser) {
        await this.createUser({
          id: createUser.user.uid,
          name: username,
        });
      }
    } catch (error) {
      return this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
    return null;
  }

  async createUser(user: { name?: string | null; id: string }) {
    if (user) {
      const userRef = doc(this.firestore, userCollection, user.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: user.id,
          name: user.name || 'Sin nombre',
        });
      }
    }
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  }

  getErrorMessage(error: unknown) {
    if (!(error instanceof FirebaseError)) {
      return {
        unknown: true,
      };
    }

    switch (error.code) {
      case AuthErrorCodes.INVALID_EMAIL:
        return {
          invalidEmail: true,
        };
      case AuthErrorCodes.EMAIL_EXISTS:
        return { emailExists: true };
      case AuthErrorCodes.INVALID_PASSWORD:
        return { invalidPassword: true };
      case AuthErrorCodes.USER_DISABLED:
        return { userDisabled: true };
      case AuthErrorCodes.USER_DELETED:
        return { userDeleted: true };
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        return { invalidLogin: true };
      default:
        return { unknown: true };
    }
  }
}
