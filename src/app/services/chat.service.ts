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
import { catchError, from, Observable, of, throwError, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Chat {
  id?: string;
  name: string;
  members: string[];
  createdAt?: FieldValue;
  createdBy?: string;
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

  getMessagesForSelectedChat(
    selectedChat$: Observable<Chat | null>,
  ): Observable<Message[]> {
    return selectedChat$.pipe(
      switchMap((chat) => (chat ? this.getMessages(chat) : of([]))),
    );
  }

  createChat(name: string, members: string[]): Observable<unknown> {
    const user = this.authService.currentUser;

    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const allMembers = this.ensureCurrentUserInMembers(user.uid, members);

    const newChat: Chat = {
      name,
      members: allMembers,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    };

    return from(addDoc(collection(this.firestore, 'chats'), newChat)).pipe(
      catchError((error) => {
        console.error('Error creating chat:', error);
        return throwError(() => new Error('Failed to create chat'));
      }),
    );
  }

  getChats(): Observable<Chat[]> {
    const user = this.authService.currentUser;

    if (!user) {
      return of([]);
    }

    const chatsQuery = query(
      collection(this.firestore, 'chats'),
      where('members', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
    );

    return collectionData(chatsQuery, { idField: 'id' }) as Observable<Chat[]>;
  }

  getMessages(chat: Chat): Observable<Message[]> {
    if (!chat.id) {
      return of([]);
    }

    const messagesQuery = query(
      collection(this.firestore, `chats/${chat.id}/messages`),
      orderBy('timestamp', 'asc'),
    );

    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  sendMessage(chat: Chat, body: string): Observable<unknown> {
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

  private ensureCurrentUserInMembers(
    userId: string,
    members: string[],
  ): string[] {
    return members.includes(userId) ? [...members] : [userId, ...members];
  }
}
