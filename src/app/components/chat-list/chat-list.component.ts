import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Chat, ChatService } from '../../chat.service';
import {
  ChatDialogData,
  CreateChatDialogComponent,
} from '../create-chat-dialog/create-chat-dialog.component';

@Component({
  selector: 'app-chat-list',
  imports: [
    AsyncPipe,
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
  readonly dialog = inject(MatDialog);

  chats$ = this.chatService.chats$;
  selectedChat$ = this.chatService.selectedChat$;

  selectChat(chat: Chat) {
    this.chatService.selectChat(chat);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateChatDialogComponent);

    dialogRef.afterClosed().subscribe((result: ChatDialogData | undefined) => {
      // console.log('The dialog was closed', result);
      if (result) {
        this.chatService.createChat(result);
      }
    });
  }
}
