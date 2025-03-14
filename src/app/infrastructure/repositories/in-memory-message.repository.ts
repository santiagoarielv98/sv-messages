import { Injectable } from '@angular/core';
import { IMessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message';

@Injectable({
  providedIn: 'root',
})
export class InMemoryMessageRepository extends IMessageRepository {
  private messages: Message[] = [];

  async send(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async getAll(): Promise<Message[]> {
    return [...this.messages];
  }
}
