import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './application/services/message.service';
import { InMemoryMessageRepository } from './infrastructure/repositories/in-memory-message.repository';
import { MessageRepository } from './domain/repositories/message.repository';
import { GetMessagesUseCase } from './domain/use-cases/get-messages.use-case';
import { SendMessageUseCase } from './domain/use-cases/send-message.use-case';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService,
    {
      provide: GetMessagesUseCase,
      useFactory: (messageRepository: MessageRepository) => new GetMessagesUseCase(messageRepository),
      deps: [MessageRepository],
    },
    {
      provide: SendMessageUseCase,
      useFactory: (messageRepository: MessageRepository) => new SendMessageUseCase(messageRepository),
      deps: [MessageRepository],
    },
    {
      provide: MessageRepository,
      useClass: InMemoryMessageRepository,
    },
  ],
})
export class AppComponent {
  title = 'sv-messages';
}
