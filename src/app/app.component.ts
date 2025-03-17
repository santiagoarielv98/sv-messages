import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import {
  GetCurrentUserUseCase,
  SignInUseCase,
  SignOutUseCase,
} from './application/use-cases/auth.use-case';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { User } from './domain/entities/user';
import { AuthRepository } from './domain/repositories/auth.repository';
import { MessageRepository } from './domain/repositories/message.repository';
import { FirebaseAuthRepository } from './infrastructure/repositories/firebase-auth.repository';
import { FirebaseMessageRepository } from './infrastructure/repositories/firebase-message.repository';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: GetMessagesUseCase,
      useFactory: (messageRepository: MessageRepository) =>
        new GetMessagesUseCase(messageRepository),
      deps: [MessageRepository],
    },
    {
      provide: SendMessageUseCase,
      useFactory: (messageRepository: MessageRepository) =>
        new SendMessageUseCase(messageRepository),
      deps: [MessageRepository],
    },
    {
      provide: MessageRepository,
      useClass: FirebaseMessageRepository,
    },
    {
      provide: AuthRepository,
      useClass: FirebaseAuthRepository,
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (authRepository: AuthRepository) =>
        new GetCurrentUserUseCase(authRepository),
      deps: [AuthRepository],
    },
    {
      provide: SignInUseCase,
      useFactory: (authRepository: AuthRepository) =>
        new SignInUseCase(authRepository),
      deps: [AuthRepository],
    },
    {
      provide: SignOutUseCase,
      useFactory: (authRepository: AuthRepository) =>
        new SignOutUseCase(authRepository),
      deps: [AuthRepository],
    },
  ],
})
export class AppComponent {
  title = 'sv-messages';
  currentUser$: Observable<User | null>;

  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private signInUseCase: SignInUseCase,
    private signOutUseCase: SignOutUseCase,
  ) {
    this.currentUser$ = this.getCurrentUserUseCase.execute();
  }

  login() {
    this.signInUseCase.execute();
  }

  logout() {
    this.signOutUseCase.execute();
  }
}
