import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  messages: Message[];
  online: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDividerModule,
    MatMenuModule,
  ],
  // template: ,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  newMessage = '';

  ngOnInit() {
    // Datos de ejemplo
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

  sendMessage() {
    if (this.selectedChat && this.newMessage.trim()) {
      const newMsg: Message = {
        id: this.selectedChat.messages.length + 1,
        text: this.newMessage,
        sender: 'me',
        timestamp: new Date(),
        read: false,
      };

      this.selectedChat.messages.push(newMsg);
      this.selectedChat.lastMessage = this.newMessage;
      this.selectedChat.timestamp = new Date();
      this.newMessage = '';

      // Simular respuesta después de un breve retraso
      setTimeout(() => {
        if (this.selectedChat) {
          const response: Message = {
            id: this.selectedChat.messages.length + 1,
            text: '👍 Recibido',
            sender: 'other',
            timestamp: new Date(),
            read: true,
          };

          this.selectedChat.messages.push(response);
          this.selectedChat.lastMessage = response.text;
          this.selectedChat.timestamp = new Date();
        }
      }, 1500);
    }
  }
}
