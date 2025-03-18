import { User, UserCredential } from '@angular/fire/auth';
import { UserEntity } from '../domain/user.entity';

export class FirebaseUserMapper {
  static toDomain(user: User | null): UserEntity | null {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    };
  }

  static fromCredentialToEntity(credential: UserCredential): UserEntity {
    if (!credential.user) {
      throw new Error('User credential invalid');
    }

    return this.toDomain(credential.user)!;
  }
}
