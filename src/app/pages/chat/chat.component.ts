import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription, tap } from 'rxjs';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { LoginDialogComponent } from '../../components/login-dialog/login-dialog.component';
import { LogoComponent } from '../../components/logo/logo.component';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AsyncPipe,
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
    ChatListComponent,
    LogoComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  sidenavService = inject(SidenavService);
  dialog = inject(MatDialog);

  chatScroll = viewChild<ElementRef>('chatScroll');
  lastChatSubscription: Subscription;

  isHandset$ = this.sidenavService.isHandset$;
  selectedChat$ = this.chatService.selectedChat$;
  messages$ = this.chatService.messages$.pipe(
    tap((messages) => {
      const lastMessage = messages[messages.length - 1];
      const isLastMessageFromCurrentUser =
        lastMessage?.sender === this.currentUser?.id;

      if (isLastMessageFromCurrentUser) {
        this.scrollToBottom();
        return;
      }

      const chatScroll = this.chatScroll()?.nativeElement;
      if (chatScroll) {
        const isScrollNearBottom =
          chatScroll.scrollTop + chatScroll.clientHeight >=
          chatScroll.scrollHeight - 100;

        if (isScrollNearBottom) {
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);
        }
      }
    }),
  );
  newMessage = '';

  constructor() {
    this.lastChatSubscription = this.chatService.lastChat$.subscribe((chat) => {
      if (chat) {
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.lastChatSubscription?.unsubscribe();
  }

  onSubmit() {
    if (!this.newMessage.trim()) {
      return;
    }

    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  onBack() {
    this.chatService.selectedChat$.next(null);
  }

  logout() {
    this.authService.logout();
  }

  scrollToBottom() {
    const chatScroll = this.chatScroll()?.nativeElement;
    if (!chatScroll) {
      return;
    }
    setTimeout(() => {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }, 0);
  }

  openSignInDialog() {
    this.dialog.open(LoginDialogComponent, {
      disableClose: true,
      width: '400px',
      height: '500px',
    });
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
