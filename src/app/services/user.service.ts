import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/models/app.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  getUserById(userId: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as Omit<User, 'id'>;
          return {
            id: docSnap.id,
            ...userData,
          } as User;
        }
        return null;
      }),
    );
  }

  updateUserProfile(
    userId: string,
    data: Partial<Omit<User, 'id'>>,
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, {
      ...data,
      // Don't allow client to directly update online status through this method
      online: data.online === undefined ? undefined : data.online,
    });
  }

  updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, {
      online: isOnline,
      lastLoginAt: isOnline ? serverTimestamp() : serverTimestamp(),
    });
  }

  searchUsers(query: string): Observable<User[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    // Firestore doesn't support native full-text search, so we'll implement a simple prefix search
    // In a production app, consider using Algolia, Elasticsearch, or Firebase Extensions for search
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', query),
      where('displayName', '<=', query + '\uf8ff'),
      limit(20),
    );

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as User,
        );
      }),
    );
  }

  getOnlineUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('online', '==', true), limit(50));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
    );
  }

  getUserContacts(userId: string): Observable<User[]> {
    // This implementation assumes there's a contacts subcollection for each user
    // You may need to adjust this based on your actual data model
    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);

    return collectionData(contactsRef, { idField: 'id' }).pipe(
      switchMap((contactDocs) => {
        if (contactDocs.length === 0) {
          return of([]);
        }

        // Get the actual user data for each contact
        const contactIds = contactDocs.map((doc) => doc['userId'] as string);
        const usersRef = collection(this.firestore, 'users');
        const q = query(usersRef, where('__name__', 'in', contactIds));

        return collectionData(q, { idField: 'id' }).pipe(
          map((users) => users as User[]),
        );
      }),
    );
  }

  addUserContact(userId: string, contactId: string): Promise<void> {
    // Adding to contacts collection - could also be implemented with arrays in user document
    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactId}`,
    );
    return setDoc(contactRef, {
      userId: contactId,
      addedAt: serverTimestamp(),
    });
  }

  setLastSeen(userId: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  getCurrentUserProfile(): Observable<User | null> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (user) {
          return this.getUserById(user.uid);
        }
        return of(null);
      }),
    );
  }

  // Additional useful methods

  getAllUsers(limitCount = 50): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, limit(limitCount));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
    );
  }

  getUsersByIds(userIds: string[]): Observable<User[]> {
    if (userIds.length === 0) {
      return of([]);
    }

    // Firebase restricts 'in' queries to 10 values, so we might need to chunk
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('__name__', 'in', userIds));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
    );
  }

  removeUserContact(userId: string, contactId: string): Promise<void> {
    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactId}`,
    );
    return setDoc(contactRef, { active: false }, { merge: true });
    // Alternative: return deleteDoc(contactRef);
  }
}
