import { inject, Injectable } from '@angular/core';
import {
  addDoc,
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
import { AuthService } from './auth.service';

export interface User {
  id: string;
  name: string;
}

export interface UserFirestore {
  id: string;
  name: string;
}

export interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  read: boolean;
}

export interface MessageFirestore {
  id: number;
  text: string;
  sender: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  participants: string[];
}

export interface ChatFirestore {
  id?: string;
  name: string;
  lastMessage: string | null;
  timestamp: Timestamp;
  participants: string[];
}

export const chatCollection = 'chats';
export const messageCollection = 'messages';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore = inject(Firestore);
  authService = inject(AuthService);

  chatCollection = collection(this.firestore, chatCollection);
  messageCollection = collection(this.firestore, messageCollection);

  chats$ = collectionData(
    query(this.chatCollection, orderBy('timestamp', 'desc')),
    {
      idField: 'id',
    },
  ).pipe(
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
    this.initUserData();
  }

  selectChat(chat: Chat) {
    this.selectedChat$.next(chat);
  }

  sendMessage(message: string) {
    if (!message.trim()) {
      return;
    }

    const user = this.authService.currentUser;
    if (!user) {
      return;
    }

    const selectedChat = this.selectedChat$.getValue();
    if (!selectedChat) {
      return;
    }
    const messagesRef = collection(
      this.firestore,
      chatCollection,
      selectedChat.id,
      messageCollection,
    );
    const newMessage: MessageFirestore = {
      id: 0,
      text: message,
      sender: user.id,
      timestamp: Timestamp.now(),
      read: false,
    };
    addDoc(messagesRef, newMessage);
    setDoc(
      doc(this.firestore, chatCollection, selectedChat.id),
      {
        lastMessage: message,
        timestamp: Timestamp.now(),
        unread: 0,
      },
      { merge: true },
    );
  }

  createChat(chat: Pick<Chat, 'name' | 'participants'>) {
    const user = this.authService.currentUser;

    if (!user) {
      return;
    }

    chat.participants.push(user.id);

    const newChat: ChatFirestore = {
      ...chat,
      lastMessage: null,
      timestamp: Timestamp.now(),
    };
    addDoc(this.chatCollection, newChat);
  }

  initUserData() {
    Array.from({ length: 10 }, (_, i) => {
      const userId = `user${i + 1}`;
      const userData = {
        name: `User ${i + 1}`,
      };
      setDoc(doc(this.firestore, 'users', userId), userData);
    });
  }
}
