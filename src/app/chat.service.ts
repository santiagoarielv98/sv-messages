import { inject, Injectable, signal } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
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
  chats = signal<Chat[]>([]);
  messages = signal<Message[]>([]);
  selectedChat = signal<Chat | null>(null);

  firestore = inject(Firestore);
  chatCollection = collection(this.firestore, chatCollection);
  messageCollection = collection(this.firestore, messageCollection);
  chats$ = collectionData(this.chatCollection, {
    idField: 'id',
  }) as Observable<ChatFirestore[]>;
  selectedChat$ = new Subject<Chat | null>();

  constructor() {
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

    this.chats$.subscribe((chats) => {
      this.chats.set(
        chats.map(
          (chat): Chat => ({
            ...chat,
            timestamp: chat.timestamp.toDate(),
          }),
        ),
      );
    });

    this.selectedChat$.subscribe((chat) => {
      this.selectedChat.set(chat);
      if (chat) {
        const chatId = chat.id;
        const messagesCollection = collection(
          this.firestore,
          chatCollection,
          chatId,
          messageCollection,
        );
        collectionData(messagesCollection, { idField: 'id' }).subscribe(
          (messages) => {
            this.messages.set(
              messages.map((message: any) => ({
                ...message,
                timestamp: message.timestamp.toDate(),
              })),
            );
          },
        );
      } else {
        this.messages.set([]);
      }
    });
  }

  selectChat(chat: Chat) {
    this.selectedChat$.next(chat);
    // this.selectedChat.set(chat);
  }

  sendMessage(message: string) {
    const selectedChat = this.selectedChat();
    console.log('selectedChat', selectedChat, message);
    // if (selectedChat && message.trim()) {
    //   const newMsg: Message = {
    //     id: selectedChat.messages.length + 1,
    //     text: message,
    //     sender: 'me',
    //     timestamp: new Date(),
    //     read: false,
    //   };
    //   selectedChat.messages.push(newMsg);
    //   selectedChat.lastMessage = message;
    //   selectedChat.timestamp = new Date();
    //   // Simular respuesta después de un breve retraso
    //   setTimeout(() => {
    //     if (selectedChat) {
    //       const response: Message = {
    //         id: selectedChat.messages.length + 1,
    //         text: '👍 Recibido',
    //         sender: 'other',
    //         timestamp: new Date(),
    //         read: true,
    //       };
    //       selectedChat.messages.push(response);
    //       selectedChat.lastMessage = response.text;
    //       selectedChat.timestamp = new Date();
    //     }
    //   }, 1500);
    // }
  }
}
