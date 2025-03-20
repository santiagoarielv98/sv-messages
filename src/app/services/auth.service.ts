import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
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
import { userCollection } from './user.service';
import { User } from './chat.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  auth = inject(Auth);
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, userCollection);
  userSubscription: Subscription;

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

  async registerUserWithGoogle() {
    const user = await signInWithPopup(this.auth, new GoogleAuthProvider());

    if (user) {
      const userRef = doc(this.firestore, userCollection, user.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: user.user.uid,
          name: user.user.displayName || 'Sin nombre',
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
}
