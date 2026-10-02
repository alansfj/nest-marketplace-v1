import {
  PipeTransform,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ZodSchema, ZodError, z } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      let schemaToUse = this.schema;

      if (schemaToUse instanceof z.ZodObject) {
        schemaToUse = schemaToUse.strict();
      }

      return schemaToUse.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((err) => {
          const path = err.path.join('.'); // e.g. "categories.1"
          return path ? `${path}: ${err.message}` : err.message;
        });

        throw new BadRequestException(messages);
      }

      console.log(error);
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
