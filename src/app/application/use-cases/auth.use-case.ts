import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable()
export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signIn('1', '2');
  }
}

@Injectable()
export class SignOutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute() {
    return this.authRepository.getCurrentUser();
  }
}
