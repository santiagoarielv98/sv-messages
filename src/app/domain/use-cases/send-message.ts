import { Message } from '../entities/message';
import { IMessageRepository } from '../repositories/message.repository';

export class SendMessage {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(message: Message): Promise<void> {
        return this.messageRepository.send(message);
    }
}
