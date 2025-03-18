import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateChatUseCase } from './application/create-chat.use-case';
import { GetChatByIdUseCase } from './application/get-chat-by-id.use-case';
import { GetChatsByUserUseCase } from './application/get-chats-by-user.use-case';
import { GetLastMessagesUseCase } from './application/get-last-messages.use-case';
import { ChatRepository } from './domain/chat.repository';
import { FirebaseChatRepository } from './infrastructure/firebase-chat.repository';
import { SendMessageUseCase } from './application/send-message.use-case.ts';

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
export const getChatByIdUseCaseFactory = (chatRepository: ChatRepository) =>
  new GetChatByIdUseCase(chatRepository);
export const getChatByIdUseCaseProvider = {
  provide: GetChatByIdUseCase,
  useFactory: getChatByIdUseCaseFactory,
  deps: [ChatRepository],
};
export const getLastMessagesUseCaseFactory = (chatRepository: ChatRepository) =>
  new GetLastMessagesUseCase(chatRepository);
export const getLastMessagesUseCaseProvider = {
  provide: GetLastMessagesUseCase,
  useFactory: getLastMessagesUseCaseFactory,
  deps: [ChatRepository],
};
export const sendMessageUseCaseFactory = (chatRepository: ChatRepository) =>
  new SendMessageUseCase(chatRepository);
export const sendMessageUseCaseProvider = {
  provide: SendMessageUseCase,
  useFactory: sendMessageUseCaseFactory,
  deps: [ChatRepository],
};
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    getChatsByUserUseCaseProvider,
    createChatUseCaseProvider,
    getChatByIdUseCaseProvider,
    getLastMessagesUseCaseProvider,
    sendMessageUseCaseProvider,
    { provide: ChatRepository, useClass: FirebaseChatRepository },
  ],
})
export class ChatModule {}
