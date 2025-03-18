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

export class FirebaseChatRepository extends ChatRepository {
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'chats');
  item$ = collectionData(this.itemCollection);

  override createChat(participants: string[]): Observable<ChatEntity> {
    const newChat: Omit<ChatEntity, 'id'> = {
      participants,
      messages: [],
    };

    return from(addDoc(this.itemCollection, newChat)).pipe(
      map((docRef) => {
        return {
          id: docRef.id,
          participants,
          messages: [],
        };
      }),
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
