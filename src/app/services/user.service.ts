import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User } from './chat.service';
import { AuthService } from './auth.service';

export const userCollection = 'users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authService = inject(AuthService);
  auth = this.authService.auth;
  firestore = inject(Firestore);
  userCollection = collection(this.firestore, userCollection);

  users$ = collectionData(this.userCollection, {
    idField: 'id',
  }).pipe(
    map((users) =>
      users.filter((user) => user.id !== this.auth.currentUser?.uid),
    ),
  ) as Observable<User[]>;
}
