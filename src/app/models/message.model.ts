import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  id?: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
}
