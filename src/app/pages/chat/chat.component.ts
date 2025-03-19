import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
export class ChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  chatId = '';
  messages$: Observable<Message[]> | undefined;
  newMessage = '';

  ngOnInit(): void {
    this.messages$ = this.route.params.pipe(
      switchMap((params) => {
        this.chatId = params['chatId'];
        return this.messageService.getMessages(this.chatId);
      }),
    );
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim() && this.chatId) {
      const message = {
        sender: 'dos', // In a real app, get this from authentication
        content: this.newMessage,
        timestamp: Date.now(),
      };

      this.newMessage = '';

      await this.messageService.sendMessage(this.chatId, message);
    }
  }
}
