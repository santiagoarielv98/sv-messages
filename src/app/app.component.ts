import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Chat, ChatService } from './services/chat.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  private selectedChatSubject = new BehaviorSubject<null | Chat>(null);

  chatName = '';
  selectedMembers: string[] = [];
  messageBody = '';

  authService = inject(AuthService);
  chatService = inject(ChatService);
  userService = inject(UserService);

  user$ = this.authService.user$;
  users$ = this.userService.users$;

  selectedChat$ = this.selectedChatSubject.asObservable();
  messages$ = this.selectedChat$.pipe(
    switchMap((chat) => (chat ? this.chatService.getMessages(chat) : of([]))),
  );

  chats$: Observable<Chat[]> = this.user$.pipe(
    switchMap((user) => (user ? this.chatService.getChats() : of([]))),
  );

  selectChat(chat: Chat | null) {
    this.selectedChatSubject.next(chat);
  }

  sendMessage() {
    this.selectedChat$.subscribe((chat) => {
      if (chat) {
        this.chatService.sendMessage(chat, this.messageBody);
        this.messageBody = '';
      }
    });
  }

  createChat() {
    this.chatService.createChat(this.chatName, this.selectedMembers);
    this.chatName = '';
    this.selectedMembers = [];
  }
}
