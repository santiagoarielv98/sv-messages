import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  template: `
    <h1>Welcome to {{ title }}!!!!!!</h1>
    <h2>Users</h2>
    <ul>
      @for (user of user$ | async; track user.id) {
        {{ user.id }}
      } @empty {
        No users found.
      }
    </ul>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  private firestore = inject(Firestore);
  private userCollection = collection(this.firestore, 'users');
  user$ = collectionData(this.userCollection, { idField: 'id' }) as Observable<
    User[]
  >;

  title = 'sv-lab2';
}
