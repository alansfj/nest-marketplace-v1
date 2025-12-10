import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const code = exception.code;

    if (code === '23505' || code === 'ER_DUP_ENTRY') {
      const message = this.extractUniqueMessage(exception);
      return response.status(400).json({ statusCode: 400, message });
    }

    if (code === '23503' || code === 'ER_NO_REFERENCED_ROW_2') {
      return response.status(400).json({
        statusCode: 400,
        message: 'Foreign key constraint violated',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Database error',
      detail: exception.detail,
    });
  }

  private extractUniqueMessage(exception: any): string {
    if (exception.detail) {
      return exception.detail
        .split('=')[1]
        .replace('(', "'")
        .replace(')', "'")
        .trim();
    }

    if (exception.sqlMessage) {
      return exception.sqlMessage;
    }

    return 'Duplicate entry';
  }
}
