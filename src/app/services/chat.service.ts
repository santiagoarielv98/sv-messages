import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  FieldValue,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface Chat {
  id?: string;
  name: string;
  members: string[];
}

export interface Message {
  id?: string;
  body: string;
  timestamp: FieldValue;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);

  constructor() {
    return;
    const chat1: Omit<Chat, 'id'> = {
      name: 'Ejemplo',
      members: ['xYwSj9VXXG8tKTWTxno4OF5s4gaL'],
    };

    const message1: Omit<Message, 'id'> = {
      body: 'Hello World',
      timestamp: serverTimestamp(),
    };

    setDoc(doc(this.firestore, 'chats', 'chat1'), chat1, {
      merge: true,
    }).then(() => {
      setDoc(doc(this.firestore, 'chats/chat1/messages/message1'), message1);
    });
  }

  createChat(name: string, members: string[]) {
    const user = this.authService.currentUser;

    if (!user) {
      return of(null);
    }

    if (!members.includes(user.uid)) {
      members.unshift(user.uid);
    }

    return from(
      addDoc(collection(this.firestore, 'chats'), {
        name,
        members,
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
    );
    return collectionData(q, {
      idField: 'id',
    }) as Observable<Chat[]>;
  }

  getMessages(chat: Chat) {
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

    if (!user) {
      return of(null);
    }

    const message: Omit<Message, 'id'> = {
      body,
      timestamp: serverTimestamp(),
    };

    return from(
      addDoc(collection(this.firestore, `chats/${chat.id}/messages`), message),
    );
  }
}
