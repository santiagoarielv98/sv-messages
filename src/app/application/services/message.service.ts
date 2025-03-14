import { Injectable } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { GetMessagesUseCase } from '../../domain/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../../domain/use-cases/send-message.use-case';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(
    private sendMessageUseCase: SendMessageUseCase,
    private getMessagesUseCase: GetMessagesUseCase) {
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
