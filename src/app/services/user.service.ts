import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
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
  writeBatch,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { User } from 'src/models/app.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  getUserById(userId: string): Observable<User | null> {
    if (!userId) {
      return of(null);
    }

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
      catchError((error) => {
        console.error(`Error fetching user ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  updateUserProfile(
    userId: string,
    data: Partial<Omit<User, 'id'>>,
  ): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }

    const userRef = doc(this.firestore, `users/${userId}`);

    // Create a clean update object without undefined values
    const updateData: Record<string, Partial<unknown>> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'online') {
        updateData[key] = value;
      }
    });

    // Allow setting online status only if explicitly passed
    if (data.online !== undefined) {
      updateData['online'] = data.online;
    }

    return from(updateDoc(userRef, updateData)).pipe(
      catchError((error) => {
        console.error(`Error updating user ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  updateUserStatus(userId: string, isOnline: boolean): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }

    const userRef = doc(this.firestore, `users/${userId}`);
    const updateData = {
      online: isOnline,
      lastLoginAt: serverTimestamp(),
    };

    return from(updateDoc(userRef, updateData)).pipe(
      catchError((error) => {
        console.error(`Error updating user status for ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  searchUsers(searchQuery: string, maxResults = 20): Observable<User[]> {
    if (!searchQuery || searchQuery.trim() === '') {
      return of([]);
    }

    // Get current user to exclude from results
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const usersRef = collection(this.firestore, 'users');

        // Firestore doesn't support native full-text search, so using prefix search
        const q = query(
          usersRef,
          where('displayName', '>=', normalizedQuery),
          where('displayName', '<=', normalizedQuery + '\uf8ff'),
          limit(maxResults + 1), // Add 1 to account for possibly excluding current user
        );

        return from(getDocs(q)).pipe(
          map((snapshot) => {
            return snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }) as User)
              .filter((user) => !currentUser || user.id !== currentUser.id)
              .slice(0, maxResults);
          }),
          catchError((error) => {
            console.error('Error searching users:', error);
            return throwError(() => error);
          }),
        );
      }),
    );
  }

  getOnlineUsers(maxResults = 50): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('online', '==', true), limit(maxResults));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
      catchError((error) => {
        console.error('Error fetching online users:', error);
        return throwError(() => error);
      }),
    );
  }

  getUserContacts(userId: string): Observable<User[]> {
    if (!userId) {
      return of([]);
    }

    const contactsRef = collection(this.firestore, `users/${userId}/contacts`);
    const q = query(contactsRef, where('active', '!=', false));

    return collectionData(q, { idField: 'contactDocId' }).pipe(
      switchMap((contactDocs) => {
        if (contactDocs.length === 0) {
          return of([]);
        }

        // Get the actual user data for each contact
        const contactIds = contactDocs.map((doc) => doc['userId'] as string);

        // Firebase restricts 'in' queries to 10 values, so chunk if needed
        if (contactIds.length <= 10) {
          return this.getUsersByIds(contactIds);
        } else {
          // Process in chunks of 10
          const chunks: string[][] = [];
          for (let i = 0; i < contactIds.length; i += 10) {
            chunks.push(contactIds.slice(i, i + 10));
          }

          // Get users for each chunk and combine results
          return from(chunks).pipe(
            switchMap((chunk) => this.getUsersByIds(chunk)),
            map((users) => {
              // Combine all chunks (this runs for each chunk)
              const allUsers: User[] = [];
              allUsers.push(...users);
              return allUsers;
            }),
          );
        }
      }),
      catchError((error) => {
        console.error(`Error fetching contacts for user ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  addUserContact(userId: string, contactId: string): Observable<void> {
    if (!userId || !contactId) {
      return throwError(
        () => new Error('Both user ID and contact ID are required'),
      );
    }

    if (userId === contactId) {
      return throwError(() => new Error('Cannot add yourself as a contact'));
    }

    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactId}`,
    );

    const contactData = {
      userId: contactId,
      addedAt: serverTimestamp(),
      active: true,
    };

    return from(setDoc(contactRef, contactData)).pipe(
      catchError((error) => {
        console.error(
          `Error adding contact ${contactId} for user ${userId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  setLastSeen(userId: string): Observable<void> {
    if (!userId) {
      return throwError(() => new Error('User ID is required'));
    }

    const userRef = doc(this.firestore, `users/${userId}`);
    return from(
      updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      }),
    ).pipe(
      catchError((error) => {
        console.error(`Error updating last seen for user ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  getCurrentUserProfile(): Observable<User | null> {
    return this.authService.user$.pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser) {
          return this.getUserById(firebaseUser.uid);
        }
        return of(null);
      }),
    );
  }

  getAllUsers(maxResults = 50): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, limit(maxResults));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
      catchError((error) => {
        console.error('Error fetching all users:', error);
        return throwError(() => error);
      }),
    );
  }

  getUsersByIds(userIds: string[]): Observable<User[]> {
    if (!userIds || userIds.length === 0) {
      return of([]);
    }

    // Firebase restricts 'in' queries to 10 values
    if (userIds.length > 10) {
      console.warn(
        'getUsersByIds received more than 10 IDs. Only the first 10 will be used.',
      );
      userIds = userIds.slice(0, 10);
    }

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('__name__', 'in', userIds));

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
      catchError((error) => {
        console.error('Error fetching users by IDs:', error);
        return throwError(() => error);
      }),
    );
  }

  removeUserContact(userId: string, contactId: string): Observable<void> {
    if (!userId || !contactId) {
      return throwError(
        () => new Error('Both user ID and contact ID are required'),
      );
    }

    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactId}`,
    );

    // Use soft delete by setting active to false
    return from(updateDoc(contactRef, { active: false })).pipe(
      catchError((error) => {
        console.error(
          `Error removing contact ${contactId} for user ${userId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  hardDeleteUserContact(userId: string, contactId: string): Observable<void> {
    if (!userId || !contactId) {
      return throwError(
        () => new Error('Both user ID and contact ID are required'),
      );
    }

    const contactRef = doc(
      this.firestore,
      `users/${userId}/contacts/${contactId}`,
    );

    // Permanently delete the document
    return from(deleteDoc(contactRef)).pipe(
      catchError((error) => {
        console.error(
          `Error deleting contact ${contactId} for user ${userId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  // Add a batch of contacts at once (useful for importing)
  addMultipleContacts(userId: string, contactIds: string[]): Observable<void> {
    if (!userId || !contactIds.length) {
      return throwError(
        () => new Error('User ID and at least one contact ID are required'),
      );
    }

    const batch = writeBatch(this.firestore);

    contactIds.forEach((contactId) => {
      if (userId !== contactId) {
        const contactRef = doc(
          this.firestore,
          `users/${userId}/contacts/${contactId}`,
        );
        batch.set(contactRef, {
          userId: contactId,
          addedAt: serverTimestamp(),
          active: true,
        });
      }
    });

    return from(batch.commit()).pipe(
      catchError((error) => {
        console.error(
          `Error adding multiple contacts for user ${userId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  // Get recently active users
  getRecentlyActiveUsers(hoursAgo = 24, maxResults = 20): Observable<User[]> {
    const hoursAgoDate = new Date();
    hoursAgoDate.setHours(hoursAgoDate.getHours() - hoursAgo);

    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef,
      where('lastLoginAt', '>=', hoursAgoDate),
      limit(maxResults),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((users) => users as User[]),
      catchError((error) => {
        console.error('Error fetching recently active users:', error);
        return throwError(() => error);
      }),
    );
  }
}
