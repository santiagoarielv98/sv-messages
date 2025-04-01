import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
  tap,
  take,
  Subject,
  takeUntil,
} from 'rxjs';
import { AuthService } from './services/auth.service';
import { Chat, ChatService } from './services/chat.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnDestroy {
  private selectedChatSubject = new BehaviorSubject<null | Chat>(null);
  private destroy$ = new Subject<void>();

  chatName = '';
  selectedMembers: string[] = [];
  messageBody = '';
  subcriptionCount = signal(0);

  authService = inject(AuthService);
  chatService = inject(ChatService);
  userService = inject(UserService);

  user$ = this.authService.user$.pipe(
    tap((user) => !user && this.selectedChatSubject.next(null)),
    takeUntil(this.destroy$),
  );
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
    if (!this.messageBody.trim()) return;

    this.selectedChat$.pipe(take(1)).subscribe((chat) => {
      if (chat) {
        this.chatService.sendMessage(chat, this.messageBody);
        this.messageBody = '';
      }
    });
  }

  createChat() {
    if (!this.chatName.trim() || this.selectedMembers.length === 0) return;

    this.chatService.createChat(this.chatName, this.selectedMembers);
    this.chatName = '';
    this.selectedMembers = [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
