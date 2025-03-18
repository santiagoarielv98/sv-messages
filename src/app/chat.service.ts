import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Chat {
  id: string;
  name: string;
  participants: string[];
}

export const chatCollection = 'chats';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  firestore = inject(Firestore);
  chatCollection = collection(this.firestore, chatCollection);
  chats$ = collectionData(this.chatCollection, { idField: 'id' }) as Observable<
    Chat[]
  >;

  constructor() {
    this.generateExample();
  }

  async generateExample() {
    const exampleChat = {
      name: 'Example Chat',
      participants: ['user1', 'user2'],
    };

    await setDoc(
      doc(this.firestore, chatCollection, 'exampleChat'),
      exampleChat,
      { merge: true },
    );
  }

  async createChat(chat: Omit<Chat, 'id'>) {
    const chatRef = await addDoc(this.chatCollection, chat);
    return chatRef.id;
  }
}
