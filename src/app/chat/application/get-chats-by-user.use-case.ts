import { Injectable } from '@angular/core';
import { ChatRepository } from '../domain/chat.repository';

@Injectable({ providedIn: 'root' })
export class GetChatsByUserUseCase {
  constructor(private chatRepository: ChatRepository) {}

  execute(userId: string) {
    return this.chatRepository.getChatsByUser(userId);
  }
}
