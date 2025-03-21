import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { interval } from 'rxjs';
// import { SidenavComponent } from './components/sidenav/sidenav.component';
// import { ChatComponent } from './pages/chat/chat.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [],
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [SidenavComponent, ChatComponent],
})
export class AppComponent {
  markForCheck = 1;
  sig = signal(1);
  byEvent = 2;
  num$ = interval(1500);

  increment() {
    // this.sig.update((x) => x + 1);
    // this.markForCheck++;
    this.byEvent++;
  }
}
