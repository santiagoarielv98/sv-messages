import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  GetCurrentUserUseCase,
  SignInUseCase,
  SignOutUseCase,
} from '../../application/use-cases/auth.use-case';
import { GetMessagesUseCase } from '../../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { Message } from '../../domain/entities/message';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { MessageListComponent } from '../components/message-list/message-list.component';

@Component({
  selector: 'app-chat',
  imports: [MessageListComponent, MessageInputComponent, AsyncPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnDestroy {
  userSubscription: Subscription;

  messages$: Observable<Message[]>;

  constructor(
    private getMessagesUseCase: GetMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
    private signOutUseCase: SignOutUseCase,
    private signInUseCase: SignInUseCase,
    private getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {
    this.messages$ = this.getMessagesUseCase.execute();
    this.userSubscription = this.getCurrentUserUseCase.execute().subscribe();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  sendMessage(content: string) {
    this.sendMessageUseCase.execute({
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      senderId: 'user',
    });
  }

  logout() {
    this.signOutUseCase.execute();
  }

  login() {
    this.signInUseCase.execute();
  }
}
