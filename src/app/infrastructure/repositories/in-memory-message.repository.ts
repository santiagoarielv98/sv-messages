import { Injectable } from '@angular/core';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InMemoryMessageRepository extends MessageRepository {
  private messages: Message[] = [];

  async send(message: Message): Promise<void> {
    this.messages.push(message);
  }

  getAll(): Observable<Message[]> {
    return of(this.messages);
  }
}
