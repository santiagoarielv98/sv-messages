import { Injectable } from '@angular/core';

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  messages: Message[];
  online: boolean;
}

export const chatCollection = 'chats';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  newMessage = '';

  constructor() {
    this.chats = [
      {
        id: 1,
        name: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Hola, ¿cómo estás?',
        timestamp: new Date('2025-03-19T10:30:00'),
        unread: 2,
        online: true,
        messages: [
          {
            id: 1,
            text: 'Hola, ¿cómo estás?',
            sender: 'other',
            timestamp: new Date('2025-03-19T10:30:00'),
            read: true,
          },
          {
            id: 2,
            text: '¡Muy bien! ¿Y tú?',
            sender: 'me',
            timestamp: new Date('2025-03-19T10:32:00'),
            read: true,
          },
          {
            id: 3,
            text: 'Todo perfecto, gracias por preguntar. Oye, ¿podemos vernos esta tarde?',
            sender: 'other',
            timestamp: new Date('2025-03-19T10:33:00'),
            read: true,
          },
        ],
      },
      {
        id: 2,
        name: 'María García',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: '¿Viste el último episodio?',
        timestamp: new Date('2025-03-19T09:15:00'),
        unread: 0,
        online: false,
        messages: [
          {
            id: 1,
            text: '¿Viste el último episodio?',
            sender: 'other',
            timestamp: new Date('2025-03-19T09:15:00'),
            read: true,
          },
        ],
      },
      {
        id: 3,
        name: 'Grupo Familia',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Papá: ¿A qué hora es la cena?',
        timestamp: new Date('2025-03-18T21:45:00'),
        unread: 5,
        online: false,
        messages: [
          {
            id: 1,
            text: '¿A qué hora es la cena?',
            sender: 'other',
            timestamp: new Date('2025-03-18T21:45:00'),
            read: false,
          },
        ],
      },
      {
        id: 4,
        name: 'Carlos Rodríguez',
        avatar: 'https://i.pravatar.cc/150?img=8',
        lastMessage: 'Te envío el archivo mañana',
        timestamp: new Date('2025-03-18T18:20:00'),
        unread: 0,
        online: true,
        messages: [
          {
            id: 1,
            text: 'Necesito el informe para mañana',
            sender: 'other',
            timestamp: new Date('2025-03-18T18:15:00'),
            read: true,
          },
          {
            id: 2,
            text: 'Te envío el archivo mañana',
            sender: 'me',
            timestamp: new Date('2025-03-18T18:20:00'),
            read: true,
          },
        ],
      },
      {
        id: 5,
        name: 'Laura Martínez',
        avatar: 'https://i.pravatar.cc/150?img=9',
        lastMessage: 'Gracias por la ayuda',
        timestamp: new Date('2025-03-17T14:30:00'),
        unread: 0,
        online: false,
        messages: [
          {
            id: 1,
            text: '¿Me puedes ayudar con esto?',
            sender: 'other',
            timestamp: new Date('2025-03-17T14:25:00'),
            read: true,
          },
          {
            id: 2,
            text: 'Claro, dime qué necesitas',
            sender: 'me',
            timestamp: new Date('2025-03-17T14:28:00'),
            read: true,
          },
          {
            id: 3,
            text: 'Gracias por la ayuda',
            sender: 'other',
            timestamp: new Date('2025-03-17T14:30:00'),
            read: true,
          },
        ],
      },
    ];
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
    // Marcar mensajes como leídos
    if (chat.unread > 0) {
      chat.unread = 0;
      chat.messages.forEach((msg) => {
        if (msg.sender === 'other') {
          msg.read = true;
        }
      });
    }
  }
}
