import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetChatsByUserUseCase } from './application/get-chats-by-user.use-case';
import { ChatRepository } from './domain/chat.repository';
import { FirebaseChatRepository } from './infrastructure/firebase-chat.repository';
import { CreateChatUseCase } from './application/create-chat.use-case';

export const getChatsByUserUseCaseFactory = (chatRepository: ChatRepository) =>
  new GetChatsByUserUseCase(chatRepository);

export const getChatsByUserUseCaseProvider = {
  provide: GetChatsByUserUseCase,
  useFactory: getChatsByUserUseCaseFactory,
  deps: [ChatRepository],
};
export const createChatUseCaseFactory = (chatRepository: ChatRepository) =>
  new CreateChatUseCase(chatRepository);
export const createChatUseCaseProvider = {
  provide: CreateChatUseCase,
  useFactory: createChatUseCaseFactory,
  deps: [ChatRepository],
};
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    getChatsByUserUseCaseProvider,
    createChatUseCaseProvider,
    { provide: ChatRepository, useClass: FirebaseChatRepository },
  ],
})
export class ChatModule {}
