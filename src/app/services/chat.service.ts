import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly firestore: Firestore = inject(Firestore);

  getChatsByUser(userId: string): Observable<Chat[]> {
    const chatsRef = collection(this.firestore, 'chats');
    const queryRef = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'desc'),
    );
    return collectionData(queryRef, { idField: 'id' }) as Observable<Chat[]>;
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const queryRef = query(messagesRef, orderBy('timestamp', 'desc'));
    return collectionData(queryRef, { idField: 'id' }) as Observable<Message[]>;
  }

  createChat(chat: Chat): Observable<string> {
    const chatData: Omit<Chat, 'id'> = {
      name: chat.name,
      createdAt: Timestamp.now(),
      participants: chat.participants,
    };

    return from(addDoc(collection(this.firestore, 'chats'), chatData)).pipe(
      map((docRef) => docRef.id),
    );
  }

  async sendMessage(chatId: string, message: Message): Promise<void> {
    if (!message.content.trim() || !message.senderId) {
      throw new Error('Message content and senderId are required');
    }
    const messageData: Omit<Message, 'id'> = {
      content: message.content,
      senderId: message.senderId,
      timestamp: Timestamp.now(),
    };

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    await addDoc(messagesRef, messageData);
  }
}
