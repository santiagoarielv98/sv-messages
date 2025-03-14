import { Message } from '../entities/message';

export interface IMessageRepository {
  send(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
}

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY'; 