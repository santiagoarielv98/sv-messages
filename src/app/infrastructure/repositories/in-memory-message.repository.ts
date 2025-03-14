import { Injectable } from '@angular/core';
import { IMessageRepository } from '../../application/interfaces/message-repository.interface';
import { Message } from '../../domain/entities/message';

@Injectable({
  providedIn: 'root',
})
export class InMemoryMessageRepository implements IMessageRepository {
  private messages: Message[] = [];

  async send(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async getAll(): Promise<Message[]> {
    return [...this.messages]; // Devolver una copia para evitar mutaciones accidentales
  }
}
