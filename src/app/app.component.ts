import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'example');
  item$ = collectionData(this.itemCollection, { idField: 'id' });
}
