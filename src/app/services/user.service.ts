import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserModel {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  users$ = this.authService.user$.pipe(
    switchMap((user) =>
      user
        ? (collectionData(collection(this.firestore, 'users'), {
            idField: 'id',
          }) as Observable<UserModel[]>)
        : of([]),
    ),
    map((users) =>
      users.filter((user) => user.id !== this.authService.currentUser?.uid),
    ),
  );
}
