import { Component, inject } from '@angular/core';
import { Chat, ChatService } from '../../chat.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  imports: [MatListModule, CommonModule],
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
