import { Observable } from 'rxjs';
import { Message } from '../entities/message';

export abstract class MessageRepository {
  abstract send(message: Message): Promise<void>;
  abstract getAll(): Observable<Message[]>;
}
