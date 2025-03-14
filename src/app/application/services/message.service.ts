import { Injectable, Inject } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { IMessageRepository, MESSAGE_REPOSITORY } from '../interfaces/message-repository.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(@Inject(MESSAGE_REPOSITORY) private messageRepository: IMessageRepository) {}

  async sendMessage(content: string, senderId: string): Promise<void> {
    const message: Message = {
      id: crypto.randomUUID(), // Generar un ID único
      content,
      timestamp: new Date(),
      senderId,
    };

    return this.messageRepository.send(message);
  }

  async getMessages(): Promise<Message[]> {
    return this.messageRepository.getAll();
  }
}
