import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User } from './chat.service';

export const userCollection = 'users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, userCollection);

  users$ = collectionData(this.userCollection, {
    idField: 'id',
  }).pipe(
    map((users) =>
      users.filter((user) => user.id !== this.auth.currentUser?.uid),
    ),
  ) as Observable<User[]>;
  user$ = user(this.auth);

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
