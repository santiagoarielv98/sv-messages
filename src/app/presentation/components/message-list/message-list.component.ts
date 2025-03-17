import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GetCurrentUserUseCase } from '../../../application/use-cases/auth.use-case';
import { Message } from '../../../domain/entities/message';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Observable } from 'rxjs';
import { User } from '../../../domain/entities/user';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-message-list',
  imports: [MessageItemComponent, AsyncPipe],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss',
})
export class MessageListComponent implements AfterViewInit, OnChanges {
  @Input() messages: Message[] | null = [];
  @ViewChild('bottom')
  private bottom!: ElementRef<HTMLDivElement>;

  currentUser$: Observable<User | null>;

  constructor(private getCurrentUserUseCase: GetCurrentUserUseCase) {
    this.currentUser$ = this.getCurrentUserUseCase.execute();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages'] && this.bottom) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  scrollToBottom(): void {
    try {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
