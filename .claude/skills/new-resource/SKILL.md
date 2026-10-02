---
name: new-resource
description: Scaffoldea un módulo/recurso nuevo completo (repositorio con interfaz abstracta, servicio con interfaz abstracta, controller, módulo, DTOs) siguiendo el patrón de inyección de dependencias por clases abstractas de este proyecto. Usar cuando el usuario pida crear un nuevo módulo, recurso o dominio desde cero (ej. "agrega un módulo de reviews", "necesito un CRUD de X").
---

# Scaffoldear un nuevo módulo/recurso

NestJS no puede inyectar por `interface` de TypeScript en runtime (se borran al compilar). Este proyecto resuelve eso usando **clases abstractas como tokens de inyección** para tanto repositorios como servicios. Sigue este orden exacto — es el mismo que siguen todos los módulos existentes.

Referencias: `src/modules/category` (el módulo más simple, cópialo como punto de partida) y `src/modules/order-item` (ejemplo con lógica de negocio real y método de repositorio custom).

Si el recurso necesita una entidad nueva de TypeORM, usa primero la skill `new-entity`.

## Orden de creación

### 1. Interfaz del repositorio — `src/types/<nombre>/<nombre>.repository.interface.ts`

```ts
import { X } from 'src/entities/x.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IXRepository extends IBaseTypeormRepository<X> {
  // solo declarar métodos CUSTOM aquí, además de los heredados (save, findOneByIdForUpdate, findAllReadOnly, etc.)
  abstract findOneByAlgoCustom(id: number): Promise<X | null>;
}
```
Si el módulo no necesita queries custom más allá de lo que da `BaseTypeormRepository`, el cuerpo queda vacío: `export abstract class IXRepository extends IBaseTypeormRepository<X> {}`.

### 2. Implementación del repositorio — `src/modules/<nombre>/<nombre>.repository.ts`

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { X, TABLE_ALIAS_X } from 'src/entities/x.entity';
import { IXRepository } from 'src/types/x/x.repository.interface';

@Injectable()
export class XTypeormRepository
  extends BaseTypeormRepository<X>
  implements IXRepository
{
  protected readonly alias = TABLE_ALIAS_X;

  constructor(@InjectRepository(X) repo: Repository<X>) {
    super(repo);
  }

  // métodos custom: usar this.qb() (ya trae el alias puesto) y this.alias
  async findOneByAlgoCustom(id: number): Promise<X | null> {
    return await this.qb()
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }
}
```
Para queries que necesiten lock (`setLock('pessimistic_write')`) combinado con un `leftJoinAndSelect`, revisa el gotcha documentado en `CLAUDE.md` sobre `lockTables` y alias entrecomillados.

### 3. Interfaz del servicio — `src/types/<nombre>/<nombre>.service.interface.ts`

```ts
import { X } from 'src/entities/x.entity';

export abstract class IXService {
  abstract metodoDeNegocio(userId: number, dto: AlgunDtoInput): Promise<X>;
}
```

### 4. Implementación del servicio — `src/modules/<nombre>/<nombre>.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { IXRepository } from 'src/types/x/x.repository.interface';
import { IXService } from 'src/types/x/x.service.interface';

@Injectable()
export class XService implements IXService {
  constructor(
    private readonly xRepository: IXRepository,
    // si depende de otro dominio, inyectar SU interfaz, nunca la clase concreta:
    // private readonly otherService: IOtherService,
  ) {}

  @Transactional() // solo si el método hace más de una escritura relacionada, o usa locks *ForUpdate*
  async metodoDeNegocio(userId: number, dto: AlgunDtoInput) {
    // lanzar BadRequestException/UnauthorizedException con mensajes claros en vez de dejar que explote
  }
}
```

### 5. Controller — `src/modules/<nombre>/<nombre>.controller.ts`

Usa la skill `new-dto` para los DTOs de entrada/salida antes o junto con este paso.

```ts
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { UserInReq } from 'src/common/decorators/user-in-req.decorator';
import { ZodValidationPipe } from 'src/common/pipes/validation.pipe';
import { DtoOutputInterceptor } from 'src/common/interceptors/dto-output.interceptor';
import { IAuthUser } from 'src/types/auth-user.interface';
import { IXService } from 'src/types/x/x.service.interface';

@Controller('x')
export class XController {
  constructor(private readonly xService: IXService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(XActionDtoOutput))
  xAction(
    @UserInReq() user: IAuthUser,
    @Body(new ZodValidationPipe(xActionSchema)) dto: XActionDtoInput,
  ) {
    return this.xService.xAction(user.id, dto);
  }
}
```

### 6. Módulo — `src/modules/<nombre>/<nombre>.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { X } from 'src/entities/x.entity';
import { XController } from './x.controller';
import { IXService } from 'src/types/x/x.service.interface';
import { XService } from './x.service';
import { IXRepository } from 'src/types/x/x.repository.interface';
import { XTypeormRepository } from './x.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([X]),
    // + módulos de otros dominios que este servicio necesite inyectar
  ],
  controllers: [XController],
  providers: [
    { provide: IXService, useClass: XService },
    { provide: IXRepository, useClass: XTypeormRepository },
  ],
  exports: [IXService], // exportar SIEMPRE la interfaz, nunca XService directamente
})
export class XModule {}
```

### 7. Registrar en el módulo padre

- Si otro módulo va a inyectar `IXService`, agregar `XModule` a sus `imports` (ver cómo `order.module.ts` importa `OrderItemModule`).
- Siempre agregar el nuevo módulo a `imports` de `AppModule` (`src/app.module.ts`).

### 8. Verificar

```bash
npm run build    # tsc debe pasar sin errores
npm run lint
npm run format
```
Si agregaste una entidad nueva, no olvides la migración (`npm run migration:generate` + `migration:run`) antes de probar el endpoint.

## Checklist rápido

- [ ] `I<X>Repository` (abstract class) en `src/types/<x>/`
- [ ] `<X>TypeormRepository` extiende `BaseTypeormRepository<X>` e implementa la interfaz
- [ ] `I<X>Service` (abstract class) en `src/types/<x>/`
- [ ] `<X>Service` implementa la interfaz, inyecta otras dependencias por su interfaz
- [ ] Controller usa `ZodValidationPipe` + `DtoOutputInterceptor`, nunca valida/transforma a mano
- [ ] Módulo provee ambos pares `{ provide: Interfaz, useClass: Implementacion }` y exporta solo la interfaz del servicio
- [ ] Módulo registrado en el módulo padre correspondiente y/o en `AppModule`
