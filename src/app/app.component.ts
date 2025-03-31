import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  authService = inject(AuthService);
  user$ = this.authService.user$;
}
