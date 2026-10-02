import { ArgumentsHost } from '@nestjs/common';

import { DatabaseExceptionFilter } from './database-exception.filter';

function buildHost() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const response = { status };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('DatabaseExceptionFilter', () => {
  let filter: DatabaseExceptionFilter;

  beforeEach(() => {
    filter = new DatabaseExceptionFilter();
  });

  it('returns 400 with the parsed field for a unique constraint violation (postgres code)', () => {
    const { host, status, json } = buildHost();
    const exception = {
      code: '23505',
      detail: 'Key (email)=(ada@example.com) already exists.',
    };

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: "'ada@example.com' already exists.",
    });
  });

  it('returns 400 using sqlMessage when detail is not present (mysql code)', () => {
    const { host, status, json } = buildHost();
    const exception = { code: 'ER_DUP_ENTRY', sqlMessage: 'Duplicate entry' };

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Duplicate entry',
    });
  });

  it('returns 400 for a foreign key constraint violation', () => {
    const { host, status, json } = buildHost();
    const exception = { code: '23503' };

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Foreign key constraint violated',
    });
  });

  it('returns 500 for any other database error', () => {
    const { host, status, json } = buildHost();
    const exception = { code: '22P02', detail: 'invalid input syntax' };

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Database error',
      detail: 'invalid input syntax',
    });
  });
});
