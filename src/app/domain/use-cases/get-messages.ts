import { Message } from '../entities/message';
import { IMessageRepository } from '../../application/interfaces/message-repository.interface';

export class GetMessages {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(): Promise<Message[]> {
        return this.messageRepository.getAll();
    }
}
