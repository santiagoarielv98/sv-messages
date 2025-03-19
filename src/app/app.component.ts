import { Component } from '@angular/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ChatComponent } from './pages/chat/chat.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
  imports: [SidenavComponent, ChatComponent],
})
export class AppComponent {}
