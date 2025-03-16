import { Observable } from 'rxjs';
import { Message } from '../../domain/entities/message';
import { MessageRepository } from '../../domain/repositories/message.repository';

export class GetMessagesUseCase {
  constructor(private messageRepository: MessageRepository) {}

  execute(): Observable<Message[]> {
    return this.messageRepository.getAll();
  }
}
