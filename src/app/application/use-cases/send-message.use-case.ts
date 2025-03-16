import { Message } from '../entities/message';
import { MessageRepository } from '../repositories/message.repository';

export class SendMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}

  async execute(message: Message): Promise<void> {
    return this.messageRepository.send(message);
  }
}
