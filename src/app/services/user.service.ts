import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const queryRef = query(usersRef, orderBy('displayName'));
    return collectionData(queryRef, { idField: 'id' }) as Observable<User[]>;
  }
}
