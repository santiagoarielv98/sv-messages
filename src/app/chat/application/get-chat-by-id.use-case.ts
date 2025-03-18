import { Injectable } from '@angular/core';
import { ChatRepository } from '../domain/chat.repository';

@Injectable({ providedIn: 'root' })
export class GetChatByIdUseCase {
  constructor(private chatRepository: ChatRepository) {}

  execute(chatId: string) {
    return this.chatRepository.getChatById(chatId);
  }
}
