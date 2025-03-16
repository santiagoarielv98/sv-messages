import { Component, OnInit } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { MessageListComponent } from '../components/message-list/message-list.component';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { GetMessagesUseCase } from '../../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';

@Component({
  selector: 'app-chat',
  imports: [MessageListComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  constructor(
    private getMessagesUseCase: GetMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
  ) {}

  async ngOnInit() {
    this.messages = await this.getMessagesUseCase.execute();
  }

  async sendMessage(content: string) {
    await this.sendMessageUseCase.execute(content);
    this.messages = await this.getMessagesUseCase.execute();
  }
}
