import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRepository } from './domain/auth.repository';
import { FirebaseAuthRepository } from './infrastructure/firebase-auth.repository';
import { GoogleLoginUseCase } from './application/google-login.use-case';
import { GetCurrentUserUseCase } from './application/get-current-user.use-case';

export const googleLoginUseCaseFactory = (authRepository: AuthRepository) =>
  new GoogleLoginUseCase(authRepository);

export const googleLoginUseCaseProvider = {
  provide: GoogleLoginUseCase,
  useFactory: googleLoginUseCaseFactory,
  deps: [AuthRepository],
};

export const getCurrentUserUseCaseFactory = (authRepository: AuthRepository) =>
  new GetCurrentUserUseCase(authRepository);

export const getCurrentUserUseCaseProvider = {
  provide: GetCurrentUserUseCase,
  useFactory: getCurrentUserUseCaseFactory,
  deps: [AuthRepository],
};

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    googleLoginUseCaseProvider,
    getCurrentUserUseCaseProvider,
    { provide: AuthRepository, useClass: FirebaseAuthRepository },
  ],
})
export class UserModule {}
