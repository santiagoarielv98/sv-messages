import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  read: boolean;
}

export interface MessageFirestore {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  // messages: Message[];
  online: boolean;
}

export interface ChatFirestore {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Timestamp;
  unread: number;
  online: boolean;
}

export const chatCollection = 'chats';
export const messageCollection = 'messages';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore = inject(Firestore);
  chatCollection = collection(this.firestore, chatCollection);
  messageCollection = collection(this.firestore, messageCollection);

  chats$ = collectionData(this.chatCollection, {
    idField: 'id',
  }).pipe(
    map((chats) =>
      (chats as ChatFirestore[]).map((chat) => ({
        ...chat,
        timestamp: chat.timestamp.toDate(),
      })),
    ),
  ) as Observable<Chat[]>;
  selectedChat$ = new BehaviorSubject<Chat | null>(null);
  messages$ = this.selectedChat$.pipe(
    distinctUntilChanged(),
    switchMap((chatId) => {
      if (!chatId) {
        return of([]);
      }

      const messagesRef = collection(
        this.firestore,
        chatCollection,
        chatId.id,
        messageCollection,
      );

      return collectionData(query(messagesRef, orderBy('timestamp', 'asc')), {
        idField: 'id',
      });
    }),
    map((messages) =>
      (messages as MessageFirestore[]).map((message) => ({
        ...message,
        timestamp: message.timestamp.toDate(),
      })),
    ),
  );

  constructor() {
    this.initExampleChat();
  }

  selectChat(chat: Chat) {
    this.selectedChat$.next(chat);
  }

  sendMessage(message: string) {
    // const selectedChat = this.selectedChat();
    console.log('selectedChat', message);
  }

  initExampleChat() {
    const example = doc(this.firestore, chatCollection, 'example');

    setDoc(
      example,
      {
        name: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hola, ¿cómo estás?',
        timestamp: new Date('2025-03-19T10:30:00'),
        unread: 2,
        online: true,
        // messages: []
      },
      { merge: true },
    ).then(() => {
      setDoc(
        doc(this.firestore, chatCollection, 'example', 'messages', '1'),
        {
          id: 1,
          text: 'Hola, ¿cómo estás?',
          sender: 'other',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: true,
        },
        { merge: true },
      );
    });
  }
}
