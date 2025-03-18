import { inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { ChatEntity } from '../domain/chat.entity';
import { ChatRepository } from '../domain/chat.repository';
import { FirebaseChatMapper } from './firebase-chat.mapper';

export class FirebaseChatRepository extends ChatRepository {
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'chats');
  item$ = collectionData(this.itemCollection);

  override createChat(participants: string[]): Observable<ChatEntity> {
    const newChat = FirebaseChatMapper.toFirestore({
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
}
