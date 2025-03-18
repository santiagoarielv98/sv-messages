import { Injectable } from '@angular/core';
import { AuthRepository } from '../domain/auth.repository';
import { Observable } from 'rxjs';
import { UserEntity } from '../domain/user.entity';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(email: string, password: string): Observable<UserEntity> {
    return this.authRepository.loginWithEmailAndPassword(email, password);
  }
}
