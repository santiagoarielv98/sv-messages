import { Message } from '../entities/message';
import { IMessageRepository } from '../../application/interfaces/message-repository.interface';

export class SendMessage {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(message: Message): Promise<void> {
        // Aquí se podría validar el mensaje o aplicar alguna regla de negocio.
        return this.messageRepository.send(message);
    }
}
