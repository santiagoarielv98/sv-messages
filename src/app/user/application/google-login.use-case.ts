import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { AuthRepository } from '../domain/auth.repository';
import { UserEntity } from '../domain/user.entity';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoginUseCase implements UseCase<void, UserEntity> {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<UserEntity> {
    return this.authRepository.loginWithGoogle();
  }
}
