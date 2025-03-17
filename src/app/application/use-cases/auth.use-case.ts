import { Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { SignInRequest } from '../dtos/sign-in.request';

@Injectable({ providedIn: 'root' })
export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute({ email, password }: Partial<SignInRequest> = {}): Promise<void> {
    return this.authRepository.signIn(email, password);
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
