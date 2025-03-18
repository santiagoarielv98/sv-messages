import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { CreateChatUseCase } from './chat/application/create-chat.use-case';
import { GetChatByIdUseCase } from './chat/application/get-chat-by-id.use-case';
import { GetChatsByUserUseCase } from './chat/application/get-chats-by-user.use-case';
import { GetLastMessagesUseCase } from './chat/application/get-last-messages.use-case';
import { SendMessageUseCase } from './chat/application/send-message.use-case.ts';
import { ChatModule } from './chat/chat.module';
import { ChatEntity } from './chat/domain/chat.entity';
import { MessageEntity } from './chat/domain/message.entity';
import { GetCurrentUserUseCase } from './user/application/get-current-user.use-case';
import { GoogleLoginUseCase } from './user/application/google-login.use-case';
import { UserEntity } from './user/domain/user.entity';
import { UserModule } from './user/user.module';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserModule, ChatModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  title = 'sv-messages';
  firestore = inject(Firestore);

  user: UserEntity | null = null;
  chats: ChatEntity[] = [];
  chat: ChatEntity | null = null;
  messages: MessageEntity[] = [];
  message = '';

  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private getChatsByUserUseCase: GetChatsByUserUseCase,
    private createChatUseCase: CreateChatUseCase,
    private getChatByIdUseCase: GetChatByIdUseCase,
    private getLastMessages: GetLastMessagesUseCase,
    private sendMessageUseCase: SendMessageUseCase,
  ) {
    this.getCurrentUserUseCase.execute().subscribe((user) => {
      this.user = user;
      this.fetchChatsIfUserExists();
    });
  }

  logout() {
    this.user = null;
    this.chats = [];
  }

  login() {
    this.googleLoginUseCase.execute().subscribe((user) => {
      this.user = user;
      this.fetchChatsIfUserExists();
    });
  }

  createChat() {
    if (this.user) {
      const participants = [this.user.uid];
      this.createChatUseCase.execute(participants);
    }
  }

  openChat(chat: ChatEntity) {
    if (this.user) {
      this.getChatByIdUseCase.execute(chat.id).subscribe((chat) => {
        this.chat = chat;
      });

      this.getLastMessages.execute(chat.id).subscribe((messages) => {
        this.messages = messages;
        console.log('Messages updated:', messages);
      });
    }
  }

  sendMessage() {
    const message = this.message.trim();
    if (!message) {
      return;
    }
    if (this.chat && this.user) {
      const messageEntity = {
        content: message,
        senderId: this.user.uid,
        chatId: this.chat.id,
        timestamp: new Date(),
      };
      this.message = '';
      this.sendMessageUseCase.execute(
        this.chat.id,
        messageEntity as MessageEntity,
      );
    }
  }

  private fetchChatsIfUserExists() {
    if (this.user) {
      this.getChatsByUserUseCase.execute(this.user.uid).subscribe((chats) => {
        this.chats = chats;
      });
    }
  }
}
