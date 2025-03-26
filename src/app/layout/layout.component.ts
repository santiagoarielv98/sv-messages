import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Observable, of, switchMap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ChatListComponent } from '../components/chat-list/chat-list.component';
import { UserToolbarComponent } from '../components/user-toolbar/user-toolbar.component';
import { Chat } from '../models/chat.model';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    MatSidenavModule,
    AsyncPipe,
    ChatListComponent,
    UserToolbarComponent,
  ],
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  userChats$: Observable<Chat[]> = this.authService.getCurrentUser().pipe(
    switchMap((user) => {
      if (!user) return of([]);
      return this.chatService.getChatsByUser(user.id);
    }),
  );
}
