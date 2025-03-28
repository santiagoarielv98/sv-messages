import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-chat-list',
  imports: [MatListModule, MatIconModule, DatePipe],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class ChatListComponent {
  @Input() chats: Chat[] = [];

  @Input() selectedChatId: string | null = null;

  @Output() chatSelected = new EventEmitter<Chat>();

  selectChat(chat: Chat) {
    this.chatSelected.emit(chat);
  }
}
