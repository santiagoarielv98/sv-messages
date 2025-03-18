import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { chatCollection } from './chat.service';

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
  firestore = inject(Firestore);
  chatCollection = collection(this.firestore, chatCollection);
}
