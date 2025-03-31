import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs';
import { UserModel } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = inject(Firestore);
  private provider: GoogleAuthProvider = new GoogleAuthProvider();
  private auth: Auth = inject(Auth);

  user$ = user(this.auth).pipe(shareReplay(1));

  async login() {
    await signInWithPopup(this.auth, this.provider).then((credential) =>
      this.createUser(credential.user),
    );
  }

  async logout() {
    await signOut(this.auth);
  }
  get currentUser() {
    return this.auth.currentUser;
  }

  private async createUser(user: User) {
    const userData: UserModel = {
      name: user.displayName || '',
    };

    await setDoc(doc(this.firestore, 'users', user.uid), userData, {
      merge: true,
    });
  }
}
