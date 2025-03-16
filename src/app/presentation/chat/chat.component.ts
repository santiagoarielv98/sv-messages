import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GetMessagesUseCase } from '../../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { Message } from '../../domain/entities/message';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { MessageListComponent } from '../components/message-list/message-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [MessageListComponent, MessageInputComponent, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  messages$: Observable<Message[]>;

  constructor(
    private getMessagesUseCase: GetMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
  ) {
    this.messages$ = this.getMessagesUseCase.execute();
  }

  sendMessage(content: string) {
    this.sendMessageUseCase.execute({
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      senderId: 'user',
    });
  }
}
