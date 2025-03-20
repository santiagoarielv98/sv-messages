import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-list-chat',
  imports: [AsyncPipe, MatListModule, RouterLink],
  templateUrl: './list-chat.component.html',
  styleUrl: './list-chat.component.scss',
})
export class ListChatComponent {
  private chatService = inject(ChatService);
  sidenavService = inject(SidenavService);

  chats$ = this.chatService.chats$;

  isHandset$ = this.sidenavService.isHandset$;
}
