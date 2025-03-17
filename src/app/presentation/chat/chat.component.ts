import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth.use-case';
import { GetMessagesUseCase } from '../../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { Message } from '../../domain/entities/message';
import { User } from '../../domain/entities/user';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { MessageListComponent } from '../components/message-list/message-list.component';

@Component({
  selector: 'app-chat',
  imports: [MessageListComponent, MessageInputComponent, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  currentUser$: Observable<User | null>;

  messages$: Observable<Message[]>;

  constructor(
    private getMessagesUseCase: GetMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {
    this.messages$ = this.getMessagesUseCase.execute();
    this.currentUser$ = this.getCurrentUserUseCase.execute();
  }

  async sendMessage(content: string) {
    const user = await firstValueFrom(this.currentUser$);

    this.sendMessageUseCase.execute({
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      senderId: user?.uid ?? 'anonymous',
      senderName: user?.displayName ?? 'Anonymous',
      senderAvatar: user?.photoURL ?? '',
    });
  }
}
