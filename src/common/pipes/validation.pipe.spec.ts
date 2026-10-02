import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './validation.pipe';

describe('ZodValidationPipe', () => {
  it('returns the parsed value when it matches the schema', () => {
    const pipe = new ZodValidationPipe(z.object({ name: z.string() }));

    expect(pipe.transform({ name: 'Ada' })).toEqual({ name: 'Ada' });
  });

  it('rejects extra properties on an object schema (forces .strict())', () => {
    const pipe = new ZodValidationPipe(z.object({ name: z.string() }));

    expect(() => pipe.transform({ name: 'Ada', extra: 'not allowed' })).toThrow(
      BadRequestException,
    );
  });

  it('formats a validation failure as "path: message"', () => {
    const pipe = new ZodValidationPipe(
      z.object({ quantity: z.number().positive() }),
    );

    try {
      pipe.transform({ quantity: -1 });
      fail('expected transform to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        message: [expect.stringContaining('quantity')],
      });
    }
  });

  it('wraps a non-Zod error as an InternalServerErrorException', () => {
    // transform() logs the unexpected error, keep the test output clean
    jest.spyOn(console, 'log').mockImplementation(() => undefined);

    const schema = z.object({
      x: z.string().transform(() => {
        throw new Error('boom');
      }),
    });
    const pipe = new ZodValidationPipe(schema);

    expect(() => pipe.transform({ x: 'a' })).toThrow(
      InternalServerErrorException,
    );
  });
});
