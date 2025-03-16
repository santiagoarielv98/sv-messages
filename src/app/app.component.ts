import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { MessageRepository } from './domain/repositories/message.repository';
import { FirebaseMessageRepository } from './infrastructure/repositories/firebase-message.repository';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
  ],
})
export class AppComponent {
  title = 'sv-messages';
}
