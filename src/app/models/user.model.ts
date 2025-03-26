import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  displayName: string;
  //   email: string;
  online: boolean;
  photoURL: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
