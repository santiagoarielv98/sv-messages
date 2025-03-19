import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Message, MessageService } from '../../message.service';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  standalone: true,
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  @ViewChild('chatContainer') private chatContainerElement!: ElementRef;

  chatId = '';
  messages$: Observable<Message[]> | undefined;
  newMessage = '';

  // Flag to track if we should scroll down
  private shouldScrollToBottom = true;
  private messagesLoaded = false;

  ngOnInit(): void {
    this.messages$ = this.route.params.pipe(
      switchMap((params) => {
        this.chatId = params['chatId'];
        this.shouldScrollToBottom = true;
        this.messagesLoaded = false;
        return this.messageService.getMessages(this.chatId);
      }),
      tap(() => {
        // Mark messages as loaded to trigger scrolling in AfterViewChecked
        this.messagesLoaded = true;
        this.shouldScrollToBottom = true;
      }),
    );
  }

  ngAfterViewChecked(): void {
    // Scroll to bottom after view is checked if needed
    if (this.shouldScrollToBottom && this.messagesLoaded) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainerElement.nativeElement.scrollTop =
        this.chatContainerElement.nativeElement.scrollHeight;
    } catch {
      //
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim() && this.chatId) {
      const message = {
        sender: 'dos', // In a real app, get this from authentication
        content: this.newMessage,
        timestamp: Date.now(),
      };

      this.newMessage = '';

      // Set flag to scroll down after sending message
      this.shouldScrollToBottom = true;

      await this.messageService.sendMessage(this.chatId, message);
    }
  }
}
