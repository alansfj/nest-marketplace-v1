import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { User } from './user.entity';

const validDto = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  password: 'hashed-password',
};

describe('User.create', () => {
  it('creates a user from a valid dto', () => {
    const user = User.create(validDto);

    expect(user.firstName).toBe('Ada');
    expect(user.lastName).toBe('Lovelace');
    expect(user.email).toBe('ada@example.com');
  });

  it.each([
    ['firstName is empty', { firstName: '' }],
    ['lastName is only whitespace', { lastName: '   ' }],
    ['email is not a valid email', { email: 'not-an-email' }],
    ['password is empty', { password: '' }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() => User.create({ ...validDto, ...overrides })).toThrow(
      EntityValidationException,
    );
  });
});
