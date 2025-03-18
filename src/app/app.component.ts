import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetCurrentUserUseCase } from './user/application/get-current-user.use-case';
import { UserEntity } from './user/domain/user.entity';
import { UserModule } from './user/user.module';
import { GoogleLoginUseCase } from './user/application/google-login.use-case';
import { GetChatsByUserUseCase } from './chat/application/get-chats-by-user.use-case';
import { ChatModule } from './chat/chat.module';
import { ChatEntity } from './chat/domain/chat.entity';
import { CreateChatUseCase } from './chat/application/create-chat.use-case';
import { GetChatByIdUseCase } from './chat/application/get-chat-by-id.use-case';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserModule, ChatModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  title = 'sv-messages';

  currentUser: UserEntity | null = null;
  userChats: ChatEntity[] = [];
  currentChat: ChatEntity | null = null;

  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private getChatsByUserUseCase: GetChatsByUserUseCase,
    private createChatUseCase: CreateChatUseCase,
    private getChatByIdUseCase: GetChatByIdUseCase,
  ) {
    this.getCurrentUserUseCase.execute().subscribe((user) => {
      this.currentUser = user;
      this.fetchChatsIfUserExists();
    });
  }

  logout() {
    this.currentUser = null;
    this.userChats = [];
  }

  login() {
    this.googleLoginUseCase.execute().subscribe((user) => {
      this.currentUser = user;
      this.fetchChatsIfUserExists();
    });
  }

  createChat() {
    if (this.currentUser) {
      const participants = [this.currentUser.uid];
      this.createChatUseCase.execute(participants);
    }
  }

  openChat(chat: ChatEntity) {
    // console.log('Opening chat:', chat);
    if (this.currentUser) {
      this.getChatByIdUseCase.execute(chat.id).subscribe((chat) => {
        console.log('Chat:', chat);
        this.currentChat = chat;
      });
    }
  }

  private fetchChatsIfUserExists() {
    if (this.currentUser) {
      this.getChatsByUserUseCase
        .execute(this.currentUser.uid)
        .subscribe((chats) => {
          console.log(chats);
          this.userChats = chats;
        });
    }
  }
}
