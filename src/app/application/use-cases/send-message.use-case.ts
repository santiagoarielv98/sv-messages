import { Message } from '../../domain/entities/message';
import { MessageRepository } from '../../domain/repositories/message.repository';

export class SendMessageUseCase {
  constructor(private messageRepository: MessageRepository) {}

  async execute(message: Message): Promise<void> {
    return this.messageRepository.send(message);
  }
}
