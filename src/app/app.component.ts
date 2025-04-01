import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap, tap, take, Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Chat, ChatService } from './services/chat.service';
import { UserService } from './services/user.service';
import { ChatStateService } from './services/chat-state.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  authService = inject(AuthService);
  chatService = inject(ChatService);
  userService = inject(UserService);
  chatStateService = inject(ChatStateService);

  // Form fields (still need these for ngModel binding, could be improved with FormGroup)
  chatName = '';
  selectedMembers: string[] = [];
  messageBody = '';

  // Observables
  user$ = this.authService.user$.pipe(
    tap((user) => !user && this.chatStateService.clearSelection()),
    takeUntil(this.destroy$),
  );
  users$ = this.userService.users$;
  selectedChat$ = this.chatStateService.selectedChat$;
  messages$ = this.chatStateService.getSelectedMessages();
  chats$: Observable<Chat[]> = this.user$.pipe(
    switchMap((user) => (user ? this.chatService.getChats() : of([]))),
  );

  async login(): Promise<void> {
    try {
      const user = await this.authService.login();
      await this.userService.createOrUpdateUser(user);
    } catch (error) {
      console.error('Login process failed:', error);
    }
  }

  selectChat(chat: Chat | null): void {
    this.chatStateService.selectChat(chat);
  }

  sendMessage(): void {
    if (!this.messageBody.trim()) return;

    this.selectedChat$.pipe(take(1)).subscribe({
      next: (chat) => {
        if (chat) {
          this.chatService.sendMessage(chat, this.messageBody);
          this.messageBody = '';
        }
      },
    });
  }

  createChat(): void {
    if (!this.chatName.trim() || this.selectedMembers.length === 0) return;

    this.chatService.createChat(this.chatName, this.selectedMembers).subscribe({
      next: () => this.resetChatForm(),
      error: (err) => console.error('Error creating chat:', err),
    });
  }

  private resetChatForm(): void {
    this.chatName = '';
    this.selectedMembers = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
