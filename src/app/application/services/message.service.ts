import { Inject, Injectable } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { GetMessagesUseCase } from '../../domain/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../domain/use-cases/send-message.use-case';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private sendMessageUseCase: SendMessageUseCase;
  private getMessagesUseCase: GetMessagesUseCase;

  constructor(private messageRepository: MessageRepository) {
    this.sendMessageUseCase = new SendMessageUseCase(messageRepository);
    this.getMessagesUseCase = new GetMessagesUseCase(messageRepository);
  }

  async sendMessage(content: string, senderId: string): Promise<void> {
    const message: Message = {
      id: crypto.randomUUID(),
      content,
      timestamp: new Date(),
      senderId,
    };

    return this.sendMessageUseCase.execute(message);
  }

  async getMessages(): Promise<Message[]> {
    return this.getMessagesUseCase.execute();
  }
}
