import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ChatService } from '../../chat.service';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-chat',
  imports: [AsyncPipe, MatListModule, RouterLink],
  templateUrl: './list-chat.component.html',
  styleUrl: './list-chat.component.scss',
})
export class ListChatComponent {
  private chatService = inject(ChatService);
  private breakpointObserver = inject(BreakpointObserver);
  chats$ = this.chatService.chats$;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
