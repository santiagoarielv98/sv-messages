import { Message } from '../../domain/entities/message';

export interface IMessageRepository {
  send(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
}

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';