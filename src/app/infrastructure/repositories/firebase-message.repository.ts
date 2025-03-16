import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Message } from '../../domain/entities/message';
import { MessageRepository } from '../../domain/repositories/message.repository';

export const messagesCollection = 'messages';

@Injectable({ providedIn: 'root' })
export class FirebaseMessageRepository extends MessageRepository {
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, messagesCollection);
  items$ = collectionData(this.itemCollection);

  override getAll(): Observable<Message[]> {
    return this.items$.pipe(map((items) => items as Message[]));
  }
  override async send(message: Message): Promise<void> {
    await addDoc(this.itemCollection, message);
  }
}
