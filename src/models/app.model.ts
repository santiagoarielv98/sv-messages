export interface User {
  id: string;
  displayName: string;
  photoURL: string;
  online: boolean;
  lastLoginAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  members: string[];
  lastMessage: Omit<Message, 'id'> | null;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

/* 
estructura en firestore
users
  userId
    displayName
    photoURL
    online
    lastLoginAt
chats
  chatId
    name
    members
    lastMessage
    messages (subcollection)
      messageId
        senderId
        content
        timestamp
*/
