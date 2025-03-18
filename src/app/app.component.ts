import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GetCurrentUserUseCase } from './user/application/get-current-user.use-case';
import { UserEntity } from './user/domain/user.entity';
import { UserModule } from './user/user.module';
import { GoogleLoginUseCase } from './user/application/google-login.use-case';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  title = 'sv-messages';

  currentUser: UserEntity | null = null;

  constructor(
    private getCurrentUserUseCase: GetCurrentUserUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
  ) {
    this.getCurrentUserUseCase.execute().subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this.currentUser = null;
  }

  login() {
    this.googleLoginUseCase.execute().subscribe((user) => {
      this.currentUser = user;
    });
  }
}
