import { Message } from '../entities/message';
import { IMessageRepository } from '../../application/interfaces/message-repository.interface';

export class SendMessage {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(message: Message): Promise<void> {
        return this.messageRepository.send(message);
    }
}
