import { inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  orderBy,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { ChatEntity } from '../domain/chat.entity';
import { ChatRepository } from '../domain/chat.repository';
import { MessageEntity } from '../domain/message.entity';
import { FirebaseChatMapper } from './firebase-chat.mapper';

export class FirebaseChatRepository extends ChatRepository {
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'chats');
  item$ = collectionData(this.itemCollection);

  override createChat(participants: string[]): Observable<ChatEntity> {
    const newChat = FirebaseChatMapper.toFirestore({
      id: '',
      lastMessage: null,
      messages: [],
      participants,
    });

    return from(addDoc(this.itemCollection, newChat)).pipe(
      map((docRef) => FirebaseChatMapper.toEntity(newChat, docRef.id)),
    );
  }

  override getChatsByUser(userId: string): Observable<ChatEntity[]> {
    const q = query(
      this.itemCollection,
      where('participants', 'array-contains', userId),
    );

    return collectionData(q, { idField: 'id' }) as Observable<ChatEntity[]>;
  }

  override getChatById(chatId: string): Observable<ChatEntity | null> {
    const chatDocRef = doc(this.firestore, 'chats', chatId);

    return from(getDoc(chatDocRef)).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data() as ChatEntity;
          return FirebaseChatMapper.toEntity(chatData, chatId);
        } else {
          return null;
        }
      }),
    );
  }
  override getLastMessages(chatId: string): Observable<MessageEntity[]> {
    const messageRef = collection(this.firestore, 'chats', chatId, 'messages');
    const q = query(messageRef, orderBy('timestamp', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<MessageEntity[]>;
  }
  override sendMessage(
    chatId: string,
    message: MessageEntity,
  ): Observable<MessageEntity> {
    const messagesRef = collection(this.firestore, 'chats', chatId, 'messages');

    // Create a copy of the message with server timestamp
    const messageToSave = {
      ...message,
      timestamp: serverTimestamp(),
    };

    return from(addDoc(messagesRef, messageToSave)).pipe(
      map((docRef) => ({
        ...message,
        id: docRef.id,
      })),
    );
  }

  override updateLastMessage(
    chatId: string,
    message: MessageEntity,
  ): Observable<void> {
    const chatDocRef = doc(this.firestore, 'chats', chatId);

    // Create a serializable version of the message for lastMessage field
    const lastMessageData = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      chatId: message.chatId,
      timestamp: serverTimestamp(),
    };

    return from(updateDoc(chatDocRef, { lastMessage: lastMessageData }));
  }
}
