import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { of } from 'rxjs';

import { DtoOutputInterceptor } from './dto-output.interceptor';

@Exclude()
class SampleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class SampleEntity {
  id = 1;
  name = 'Ada';
  password = 'secret';
}

function buildCallHandler(data: unknown): CallHandler {
  return { handle: () => of(data) };
}

const context = {} as ExecutionContext;

describe('DtoOutputInterceptor', () => {
  it('passes falsy data through unchanged', (done) => {
    const interceptor = new DtoOutputInterceptor(SampleDto);

    interceptor
      .intercept(context, buildCallHandler(null))
      .subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
  });

  it('strips fields not marked with @Expose when a dto is given', (done) => {
    const interceptor = new DtoOutputInterceptor(SampleDto);

    interceptor
      .intercept(context, buildCallHandler(new SampleEntity()))
      .subscribe((result) => {
        expect(result).toEqual({ id: 1, name: 'Ada' });
        expect(result.password).toBeUndefined();
        done();
      });
  });

  it('applies the transformation to every item of an array', (done) => {
    const interceptor = new DtoOutputInterceptor(SampleDto);
    const entities = [
      new SampleEntity(),
      { id: 2, name: 'Bob', password: 'x' },
    ];

    interceptor
      .intercept(context, buildCallHandler(entities))
      .subscribe((result) => {
        expect(result).toEqual([
          { id: 1, name: 'Ada' },
          { id: 2, name: 'Bob' },
        ]);
        done();
      });
  });

  it('returns the plain data unchanged when no dto class is given', (done) => {
    const interceptor = new DtoOutputInterceptor(undefined);
    const entity = new SampleEntity();

    interceptor
      .intercept(context, buildCallHandler(entity))
      .subscribe((result) => {
        expect(result).toEqual({ id: 1, name: 'Ada', password: 'secret' });
        done();
      });
  });
});
