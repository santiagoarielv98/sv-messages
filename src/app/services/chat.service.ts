import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  FieldValue,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface Chat {
  id?: string;
  name: string;
  members: string[];
}

export interface Message {
  id?: string;
  body: string;
  senderId: string;
  senderName?: string;
  timestamp: FieldValue;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  createChat(name: string, members: string[]) {
    const user = this.authService.currentUser;

    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    if (!members.includes(user.uid)) {
      members.unshift(user.uid);
    }

    return from(
      addDoc(collection(this.firestore, 'chats'), {
        name,
        members,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      }),
    ).pipe(
      catchError((error) => {
        console.error('Error creating chat:', error);
        return throwError(() => new Error('Failed to create chat'));
      }),
    );
  }

  getChats() {
    const user = this.authService.currentUser;
    if (!user) {
      return of([]);
    }
    const q = query(
      collection(this.firestore, 'chats'),
      where('members', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
    );
    return collectionData(q, {
      idField: 'id',
    }) as Observable<Chat[]>;
  }

  getMessages(chat: Chat) {
    if (!chat.id) return of([]);

    const q = query(
      collection(this.firestore, `chats/${chat.id}/messages`),
      orderBy('timestamp', 'asc'),
    );
    return collectionData(q, {
      idField: 'id',
    }) as Observable<Message[]>;
  }

  sendMessage(chat: Chat, body: string) {
    const user = this.authService.currentUser;

    if (!user || !chat.id) {
      return throwError(
        () => new Error('User not authenticated or invalid chat'),
      );
    }

    const message: Omit<Message, 'id'> = {
      body,
      senderId: user.uid,
      senderName: user.displayName || '',
      timestamp: serverTimestamp(),
    };

    return from(
      addDoc(collection(this.firestore, `chats/${chat.id}/messages`), message),
    ).pipe(
      catchError((error) => {
        console.error('Error sending message:', error);
        return throwError(() => new Error('Failed to send message'));
      }),
    );
  }
}
