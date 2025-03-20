import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
  addDoc,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}
export const messageCollection = 'messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private firestore = inject(Firestore);

  getMessages(chatId: string): Observable<Message[]> {
    const messagesRef = collection(
      this.firestore,
      'chats',
      chatId,
      messageCollection,
    );
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    return collectionData(messagesQuery, { idField: 'id' }) as Observable<
      Message[]
    >;
  }

  async sendMessage(
    chatId: string,
    message: Omit<Message, 'id'>,
  ): Promise<string> {
    // Send to the subcollection of the specific chat
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const messageRef = await addDoc(messagesRef, message);
    return messageRef.id;
  }
}
