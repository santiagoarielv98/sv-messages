import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatEntity } from '../domain/chat.entity';
import { ChatRepository } from '../domain/chat.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateChatUseCase {
  constructor(private chatRepository: ChatRepository) {}

  execute(participants: string[]): Observable<ChatEntity> {
    return this.chatRepository.createChat(participants);
  }
}
