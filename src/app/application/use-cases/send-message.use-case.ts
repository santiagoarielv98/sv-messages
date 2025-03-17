import { Injectable } from '@angular/core';
import { Message } from '../../domain/entities/message';
import { MessageRepository } from '../../domain/repositories/message.repository';

@Injectable({ providedIn: 'root' })
export class SendMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}

  async execute(message: Message): Promise<void> {
    return this.messageRepository.send(message);
  }
}
