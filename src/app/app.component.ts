import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { MessageService } from './application/services/message.service';
import { InMemoryMessageRepository } from './infrastructure/repositories/in-memory-message.repository';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService,
    { provide: MESSAGE_REPOSITORY, useClass: InMemoryMessageRepository }
  ],
})
export class AppComponent {
  title = 'sv-messages';
}
