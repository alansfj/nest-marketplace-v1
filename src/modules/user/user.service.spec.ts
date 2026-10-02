import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IUserRepository } from 'src/types/user/user.repository.interface';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';
import { User } from 'src/entities/user.entity';

jest.mock('bcrypt');

// registerNewUser is decorated with @Transactional(), which needs a real,
// initialized DataSource. See order.service.spec.ts for why this is mocked
// as a pass-through here.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { UserService } from './user.service';

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

describe('UserService', () => {
  let configService: jest.Mocked<ConfigService>;
  let userRepository: jest.Mocked<IUserRepository>;
  let userBalanceService: jest.Mocked<IUserBalanceService>;
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();

    configService = {
      get: jest.fn().mockReturnValue(10),
    } as unknown as jest.Mocked<ConfigService>;
    userRepository = {
      findOneByEqualForUpdate: jest.fn(),
      findOneByIdReadOnly: jest.fn(),
      findOneByIdForUpdate: jest.fn(),
      existsByEqual: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    } as unknown as jest.Mocked<IUserRepository>;
    userBalanceService = {
      createForNewUser: jest.fn(),
    } as unknown as jest.Mocked<IUserBalanceService>;

    service = new UserService(
      configService,
      userRepository,
      userBalanceService,
    );
  });

  describe('getUserForPasswordValidation', () => {
    it('returns the user when found', async () => {
      const user = buildUser();
      userRepository.findOneByEqualForUpdate.mockResolvedValue(user);

      await expect(
        service.getUserForPasswordValidation('ada@example.com'),
      ).resolves.toBe(user);
    });

    it('throws when no user matches the email', async () => {
      userRepository.findOneByEqualForUpdate.mockResolvedValue(null);

      await expect(
        service.getUserForPasswordValidation('nobody@example.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAuthorizedUser', () => {
    it('returns the user when found', async () => {
      const user = buildUser();
      userRepository.findOneByIdReadOnly.mockResolvedValue(user);

      await expect(service.getAuthorizedUser(1)).resolves.toBe(user);
    });

    it('throws Unauthorized when the user is not found', async () => {
      userRepository.findOneByIdReadOnly.mockResolvedValue(null);

      await expect(service.getAuthorizedUser(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getUserFromId', () => {
    it('returns the user when found', async () => {
      const user = buildUser();
      userRepository.findOneByIdForUpdate.mockResolvedValue(user);

      await expect(service.getUserFromId(1)).resolves.toBe(user);
    });

    it('throws Unauthorized when the user is not found', async () => {
      userRepository.findOneByIdForUpdate.mockResolvedValue(null);

      await expect(service.getUserFromId(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerNewUser', () => {
    const dto = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'plain-password',
    };

    it('rejects registering an email that already exists', async () => {
      userRepository.existsByEqual.mockResolvedValue(true);

      await expect(service.registerNewUser(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('hashes the password before persisting the new user', async () => {
      userRepository.existsByEqual.mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.registerNewUser(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10);
      expect(result.password).toBe('hashed-password');
      expect(result.email).toBe('ada@example.com');
    });

    it('creates a balance for the newly registered user', async () => {
      userRepository.existsByEqual.mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await service.registerNewUser(dto);

      expect(userBalanceService.createForNewUser).toHaveBeenCalledWith(result);
    });
  });
});
