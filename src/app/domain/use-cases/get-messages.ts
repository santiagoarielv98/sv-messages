import { Message } from '../entities/message';
import { IMessageRepository } from '../repositories/message.repository';

export class GetMessages {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(): Promise<Message[]> {
        return this.messageRepository.getAll();
    }
}
