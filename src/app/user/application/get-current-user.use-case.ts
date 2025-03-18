import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/auth.repository';
import { UserEntity } from '../domain/user.entity';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<UserEntity | null> {
    return this.authRepository.getCurrentUser();
  }
}
