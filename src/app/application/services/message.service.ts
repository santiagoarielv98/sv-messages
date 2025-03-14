import { Injectable, Inject } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { IMessageRepository, MESSAGE_REPOSITORY } from '../interfaces/message-repository.interface';
import { SendMessage } from '../../domain/use-cases/send-message';
import { GetMessages } from '../../domain/use-cases/get-messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private sendMessageUseCase: SendMessage;
  private getMessagesUseCase: GetMessages;

  constructor(@Inject(MESSAGE_REPOSITORY) private messageRepository: IMessageRepository) {
    this.sendMessageUseCase = new SendMessage(messageRepository);
    this.getMessagesUseCase = new GetMessages(messageRepository);
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
