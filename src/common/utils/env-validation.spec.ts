import { validate } from './env-validation';

function buildValidConfig(overrides: Record<string, string> = {}) {
  return {
    PORT: '3000',
    POSTGRES_USER: 'postgres',
    POSTGRES_DB: 'marketplace',
    POSTGRES_PASSWORD: 'secret',
    POSTGRES_URL: 'postgresql://localhost:5432/marketplace',
    POSTGRES_HOST: 'localhost',
    POSTGRES_PORT: '5432',
    JWT_SECRET: 'a'.repeat(20),
    SALT_ROUNDS: '10',
    ...overrides,
  };
}

describe('validate (env config)', () => {
  it('parses a valid config and converts numeric fields to numbers', () => {
    const result = validate(buildValidConfig());

    expect(result.PORT).toBe(3000);
    expect(result.POSTGRES_PORT).toBe(5432);
    expect(result.SALT_ROUNDS).toBe(10);
  });

  it('rejects a non-numeric PORT', () => {
    expect(() => validate(buildValidConfig({ PORT: 'not-a-number' }))).toThrow(
      /PORT/,
    );
  });

  it('rejects a PORT out of the valid range', () => {
    expect(() => validate(buildValidConfig({ PORT: '99999' }))).toThrow(/PORT/);
  });

  it('rejects a JWT_SECRET shorter than 20 characters', () => {
    expect(() =>
      validate(buildValidConfig({ JWT_SECRET: 'too-short' })),
    ).toThrow(/JWT_SECRET/);
  });

  it('rejects a missing required variable', () => {
    const config = buildValidConfig();
    delete (config as any).POSTGRES_DB;

    expect(() => validate(config)).toThrow(/POSTGRES_DB/);
  });
});
