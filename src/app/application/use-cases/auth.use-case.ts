import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signIn('1', '2');
  }
}

@Injectable({ providedIn: 'root' })
export class SignOutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}

@Injectable({ providedIn: 'root' })
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute() {
    return this.authRepository.getCurrentUser();
  }
}
