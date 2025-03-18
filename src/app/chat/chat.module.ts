import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetChatsByUserUseCase } from './application/get-chats-by-user.use-case';
import { ChatRepository } from './domain/chat.repository';
import { FirebaseChatRepository } from './infrastructure/firebase-chat.repository';

export const getChatsByUserUseCaseFactory = (chatRepository: ChatRepository) =>
  new GetChatsByUserUseCase(chatRepository);

export const getChatsByUserUseCaseProvider = {
  provide: GetChatsByUserUseCase,
  useFactory: getChatsByUserUseCaseFactory,
  deps: [ChatRepository],
};

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    getChatsByUserUseCaseProvider,
    { provide: ChatRepository, useClass: FirebaseChatRepository },
  ],
})
export class ChatModule {}
