import { Injectable } from '@angular/core';
import { ChatRepository } from '../domain/chat.repository';
import { MessageEntity } from '../domain/message.entity';

@Injectable({ providedIn: 'root' })
export class SendMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  execute(chatId: string, message: MessageEntity) {
    return this.chatRepository.sendMessage(chatId, message);
  }
}
