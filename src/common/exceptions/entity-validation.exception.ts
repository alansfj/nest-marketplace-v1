import { InternalServerErrorException } from '@nestjs/common';

export class EntityValidationException extends InternalServerErrorException {
  constructor(
    entityName: string,
    errors: string[] | Record<string, any> | string,
  ) {
    super({
      statusCode: 500,
      error: `Entity validation failed (${entityName})`,
      message: errors,
    });
  }
}
