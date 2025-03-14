import { Message } from '../entities/message';
import { MessageRepository } from '../repositories/message.repository';

export class GetMessagesUseCase {
    constructor(private messageRepository: MessageRepository) { }

    async execute(): Promise<Message[]> {
        return this.messageRepository.getAll();
    }
}
