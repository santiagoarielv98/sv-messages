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
  userChats: ChatEntity[] = []; // Added property to store user chats

  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private getChatsByUserUseCase: GetChatsByUserUseCase,
    private createChatUseCase: CreateChatUseCase,
  ) {
    this.getCurrentUserUseCase.execute().subscribe((user) => {
      this.currentUser = user;
      this.fetchChatsIfUserExists(); // Fetch chats after user is loaded
    });
  }

  logout() {
    this.currentUser = null;
    this.userChats = []; // Clear chats when user logs out
  }

  login() {
    this.googleLoginUseCase.execute().subscribe((user) => {
      this.currentUser = user;
      this.fetchChatsIfUserExists(); // Fetch chats after login
    });
  }

  async createChat() {
    if (this.currentUser) {
      const participants = [this.currentUser.uid];
      this.createChatUseCase.execute(participants);
    }
  }

  // New method to fetch chats if user exists
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
