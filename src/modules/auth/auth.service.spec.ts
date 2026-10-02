import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { IUserService } from 'src/types/user/user.service.interface';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

function buildUser(overrides: Partial<User> = {}): User {
  return {
    __brand: 'User',
    id: 1,
    email: 'ada@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    password: 'hashed-password',
    ...overrides,
  } as unknown as User;
}

describe('AuthService', () => {
  let userService: jest.Mocked<IUserService>;
  let jwtService: jest.Mocked<JwtService>;
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();

    userService = {
      getUserForPasswordValidation: jest.fn(),
      registerNewUser: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;
    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new AuthService(userService, jwtService);
  });

  describe('validateUserPassword', () => {
    it('returns the user when the password matches', async () => {
      const user = buildUser();
      userService.getUserForPasswordValidation.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.validateUserPassword('ada@example.com', 'plain-password'),
      ).resolves.toBe(user);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plain-password',
        'hashed-password',
      );
    });

    it('rejects when the password does not match', async () => {
      userService.getUserForPasswordValidation.mockResolvedValue(buildUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUserPassword('ada@example.com', 'wrong-password'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('signs a jwt with the user data', async () => {
      jwtService.signAsync.mockResolvedValue('signed-token');

      const result = await service.login(buildUser());

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: 'ada@example.com',
        sub: 1,
        firstName: 'Ada',
        lastName: 'Lovelace',
      });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });
});
