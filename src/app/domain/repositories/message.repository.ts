import { Observable } from 'rxjs';
import { Message } from '../entities/message';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class MessageRepository {
  abstract send(message: Message): Promise<void>;
  abstract getAll(): Observable<Message[]>;
}
