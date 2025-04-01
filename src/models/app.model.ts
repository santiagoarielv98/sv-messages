import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  displayName: string;
  photoURL: string;
  online: boolean;
  lastLoginAt: Timestamp;
}

export interface Chat {
  id: string;
  name: string;
  members: string[];
  lastMessage: Omit<Message, 'id'> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
}

export interface ReadReceipt {
  userId: string;
  timestamp: Date;
}

export interface ChatMember {
  userId: string;
  joinedAt: Date;
  isAdmin?: boolean;
}

export interface Contact {
  userId: string;
  addedAt: Date;
  active: boolean;
}

export interface TypingIndicator {
  userId: string;
  timestamp: Date;
}

export interface MessageAttachment {
  url: string;
  type: 'image' | 'file' | 'audio';
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface UserStatus {
  online: boolean;
  lastSeen: Date;
  isTyping?: boolean;
}
