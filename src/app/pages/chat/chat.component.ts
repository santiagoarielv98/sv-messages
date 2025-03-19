import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatService } from '../../chat.service';

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
export class ChatComponent {
  private chatService = inject(ChatService);
  chats = this.chatService.chats;
  selectedChat = this.chatService.selectedChat;
  newMessage = '';

  sendMessage() {
    // if (this.selectedChat && this.newMessage.trim()) {
    //   const newMsg: Message = {
    //     id: this.selectedChat().messages.length + 1,
    //     text: this.newMessage,
    //     sender: 'me',
    //     timestamp: new Date(),
    //     read: false,
    //   };
    //   this.selectedChat.messages.push(newMsg);
    //   this.selectedChat.lastMessage = this.newMessage;
    //   this.selectedChat.timestamp = new Date();
    //   this.newMessage = '';
    //   // Simular respuesta después de un breve retraso
    //   setTimeout(() => {
    //     if (this.selectedChat) {
    //       const response: Message = {
    //         id: this.selectedChat.messages.length + 1,
    //         text: '👍 Recibido',
    //         sender: 'other',
    //         timestamp: new Date(),
    //         read: true,
    //       };
    //       this.selectedChat.messages.push(response);
    //       this.selectedChat.lastMessage = response.text;
    //       this.selectedChat.timestamp = new Date();
    //     }
    //   }, 1500);
    // }
  }
}
