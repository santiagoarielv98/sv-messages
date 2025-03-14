import { Message } from '../entities/message';

export abstract class IMessageRepository {
  abstract send(message: Message): Promise<void>;
  abstract getAll(): Promise<Message[]>;
}