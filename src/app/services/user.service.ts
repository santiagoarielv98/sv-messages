import { inject, Injectable } from '@angular/core';
import {
  doc,
  collection,
  collectionData,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';

export interface UserModel {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users$: Observable<UserModel[]>;

  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  constructor() {
    this.users$ = this.initializeUsers();
  }

  private initializeUsers(): Observable<UserModel[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return collectionData(collection(this.firestore, 'users'), {
          idField: 'id',
        }) as Observable<UserModel[]>;
      }),
      map((users) =>
        users.filter((user) => user.id !== this.authService.currentUser?.uid),
      ),
    );
  }

  async createOrUpdateUser(user: User): Promise<void> {
    const userData: UserModel = {
      name: user.displayName || '',
    };

    await setDoc(doc(this.firestore, 'users', user.uid), userData, {
      merge: true,
    });
  }
}
