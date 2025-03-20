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
    const example2 = doc(this.firestore, chatCollection, 'example2');

    setDoc(
      example,
      {
        name: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hola, ¿cómo estás?',
        timestamp: new Date('2025-03-19T10:30:00'),
        unread: 2,
        online: true,
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
    setDoc(
      example2,
      {
        name: 'María García',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'Hasta luego',
        timestamp: new Date('2025-03-19T10:30:00'),
        unread: 1,
        online: false,
      },
      { merge: true },
    ).then(async () => {
      await setDoc(
        doc(this.firestore, chatCollection, 'example2', 'messages', '1'),
        {
          id: 1,
          text: 'Hay novedades sobre el proyecto',
          sender: 'other',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: true,
        },
        { merge: true },
      );

      await setDoc(
        doc(this.firestore, chatCollection, 'example2', 'messages', '2'),
        {
          id: 2,
          text: '¿Podemos hablar?',
          sender: 'me',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: false,
        },
        { merge: true },
      );

      await setDoc(
        doc(this.firestore, chatCollection, 'example2', 'messages', '3'),
        {
          id: 3,
          text: 'Claro, ¿a qué hora?',
          sender: 'other',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: false,
        },
        { merge: true },
      );

      await setDoc(
        doc(this.firestore, chatCollection, 'example2', 'messages', '4'),
        {
          id: 4,
          text: 'A las 3pm',
          sender: 'other',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: false,
        },
        { merge: true },
      );

      await setDoc(
        doc(this.firestore, chatCollection, 'example2', 'messages', '5'),
        {
          id: 5,
          text: 'Perfecto, nos vemos entonces',
          sender: 'me',
          timestamp: new Date('2025-03-19T10:30:00'),
          read: false,
        },
        { merge: true },
      );
    });
  }
}
