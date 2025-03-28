import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly firestore = inject(Firestore);
  private readonly authService: AuthService = inject(AuthService);

  private currentUser: User | null = null;

  constructor() {
    this.authService
      .getCurrentUser()
      .subscribe((user: User | null) => (this.currentUser = user));
  }

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const queryRef = query(usersRef, orderBy('displayName'));
    return collectionData(queryRef, { idField: 'id' }).pipe(
      map((users) => users.filter((user) => user.id === this.currentUser?.id)),
    ) as Observable<User[]>;
  }
}
