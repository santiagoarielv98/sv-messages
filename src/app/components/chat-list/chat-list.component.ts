import { Component, inject } from '@angular/core';
import { Chat, ChatService } from '../../chat.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat-list',
  imports: [
    MatListModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  private chatService = inject(ChatService);
  selectedChat = this.chatService.selectedChat;
  chats = this.chatService.chats;

  selectChat(chat: Chat) {
    this.chatService.selectChat(chat);
  }
}
