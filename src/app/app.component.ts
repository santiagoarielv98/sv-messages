import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './application/services/message.service';
import { IMessageRepository } from './domain/repositories/message.repository';
import { InMemoryMessageRepository } from './infrastructure/repositories/in-memory-message.repository';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService,
    { provide: IMessageRepository, useClass: InMemoryMessageRepository }
  ],
})
export class AppComponent {
  title = 'sv-messages';
}
