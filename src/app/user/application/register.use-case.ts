import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/auth.repository';
import { UserEntity } from '../domain/user.entity';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(
    email: string,
    password: string,
    displayName?: string,
  ): Observable<UserEntity> {
    return this.authRepository.registerWithEmailAndPassword(
      email,
      password,
      displayName,
    );
  }
}
