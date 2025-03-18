import { Injectable } from '@angular/core';

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
export class MessageService {}
