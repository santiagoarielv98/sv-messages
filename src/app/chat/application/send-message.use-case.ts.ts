import { Injectable } from '@angular/core';
import { ChatRepository } from '../domain/chat.repository';
import { MessageEntity } from '../domain/message.entity';
import { switchMap, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SendMessageUseCase {
  constructor(private chatRepository: ChatRepository) {}

  execute(chatId: string, message: MessageEntity) {
    return this.chatRepository.sendMessage(chatId, message).pipe(
      tap((sentMessage) => console.log('Message sent:', sentMessage)),
      switchMap((sentMessage) => {
        return this.chatRepository.updateLastMessage(chatId, sentMessage).pipe(
          tap(() => console.log('Last message updated')),
          map(() => sentMessage),
        );
      }),
    );
  }
}
