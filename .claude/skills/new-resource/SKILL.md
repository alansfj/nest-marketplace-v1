---
name: new-resource
description: Scaffoldea un módulo/recurso nuevo completo (repositorio con interfaz abstracta, servicio con interfaz abstracta, controller, módulo, DTOs) siguiendo el patrón de inyección de dependencias por clases abstractas, independiente del dominio del proyecto. Usar cuando el usuario pida crear un nuevo módulo, recurso o dominio desde cero (ej. "agrega un módulo de reviews", "necesito un CRUD de X").
---

# Scaffoldear un nuevo módulo/recurso

NestJS no puede inyectar por `interface` de TypeScript en runtime (se borran al compilar). Este patrón resuelve eso usando **clases abstractas como tokens de inyección**, tanto para repositorios como para servicios. Sigue este orden — es el mismo en todos los módulos que siguen este patrón.

Si el recurso necesita una entidad nueva, usa primero la skill `new-entity`. Para los DTOs de entrada/salida, usa `new-dto` junto con este scaffold.

Las utilidades base viven en `docs/nest-ddd-pattern/` de este proyecto:
- `docs/nest-ddd-pattern/types/base-typeorm.repository.interface.ts` — `IBaseTypeormRepository<TEntity>`.
- `docs/nest-ddd-pattern/common/repositories/base-typeorm.repository.ts` — `BaseTypeormRepository<TEntity>`, la implementación que cada repositorio concreto extiende.
- `docs/nest-ddd-pattern/common/pipes/validation.pipe.ts` y `.../common/interceptors/dto-output.interceptor.ts` — usados por el controller (paso 5).

Si estás en OTRO proyecto, copia esos archivos a tu `src/` primero (ver `docs/nest-ddd-pattern/README.md`).

## Orden de creación

### 1. Interfaz del repositorio — `types/<nombre>/<nombre>.repository.interface.ts`

```ts
import { X } from '../../entities/x.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IXRepository extends IBaseTypeormRepository<X> {
  // solo declarar métodos CUSTOM aquí, además de los heredados (save, findOneByIdForUpdate, findAllReadOnly, etc.)
  abstract findOneByAlgoCustom(id: number): Promise<X | null>;
}
```
Si el módulo no necesita queries custom más allá de lo que da `BaseTypeormRepository`, el cuerpo queda vacío: `export abstract class IXRepository extends IBaseTypeormRepository<X> {}`.

### 2. Implementación del repositorio — `modules/<nombre>/<nombre>.repository.ts`

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseTypeormRepository } from '../../common/repositories/base-typeorm.repository';
import { X, TABLE_ALIAS_X } from '../../entities/x.entity';
import { IXRepository } from '../../types/x/x.repository.interface';

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

### 3. Interfaz del servicio — `types/<nombre>/<nombre>.service.interface.ts`

```ts
import { X } from '../../entities/x.entity';

export abstract class IXService {
  abstract metodoDeNegocio(dto: AlgunDtoInput): Promise<X>;
}
```

### 4. Implementación del servicio — `modules/<nombre>/<nombre>.service.ts`

```ts
import { Injectable } from '@nestjs/common';

import { IXRepository } from '../../types/x/x.repository.interface';
import { IXService } from '../../types/x/x.service.interface';

@Injectable()
export class XService implements IXService {
  constructor(
    private readonly xRepository: IXRepository,
    // si depende de otro dominio, inyectar SU interfaz, nunca la clase concreta:
    // private readonly otherService: IOtherService,
  ) {}

  async metodoDeNegocio(dto: AlgunDtoInput) {
    // lanzar BadRequestException con un mensaje claro en vez de dejar que explote
  }
}
```

### 5. Controller — `modules/<nombre>/<nombre>.controller.ts`

Usa la skill `new-dto` para los DTOs de entrada/salida antes o junto con este paso.

```ts
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import { DtoOutputInterceptor } from '../../common/interceptors/dto-output.interceptor';
import { IXService } from '../../types/x/x.service.interface';

@Controller('x')
export class XController {
  constructor(private readonly xService: IXService) {}

  @Post()
  @UseInterceptors(new DtoOutputInterceptor(XActionDtoOutput))
  xAction(
    @Body(new ZodValidationPipe(xActionSchema)) dto: XActionDtoInput,
  ) {
    return this.xService.xAction(dto);
  }
}
```
Si el proyecto tiene autenticación, el usuario en sesión normalmente se obtiene vía un decorador de parámetro propio del proyecto (ej. algo como `@UserInReq()`) que lee `req.user` — revisa cómo lo hacen los demás controllers del proyecto en vez de inventar uno nuevo.

### 6. Módulo — `modules/<nombre>/<nombre>.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { X } from '../../entities/x.entity';
import { XController } from './x.controller';
import { IXService } from '../../types/x/x.service.interface';
import { XService } from './x.service';
import { IXRepository } from '../../types/x/x.repository.interface';
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

- Si otro módulo va a inyectar `IXService`, agrega `XModule` a sus `imports`.
- Agrega el nuevo módulo a `imports` del módulo raíz de la aplicación.

### 8. Verificar

```bash
npm run build    # tsc debe pasar sin errores
npm run lint
```
Si agregaste una entidad nueva, no olvides generar y correr la migración antes de probar el endpoint.

## Transacciones y locking (cuando aplique)

Si un método hace **múltiples escrituras relacionadas**, envuélvelo en `@Transactional()` (de la librería `typeorm-transactional`, si el proyecto la usa). Si el método depende de un valor que otra request concurrente podría cambiar antes de terminar (stock, saldo, cupos disponibles...), usa la variante `*ForUpdate` del repositorio (lock pesimista) en vez de la `*ReadOnly`.

**Gotcha de locking + joins**: combinar un lock (`setLock('pessimistic_write')`) con un `leftJoinAndSelect` falla en Postgres — "no se puede bloquear el lado nullable de un outer join" — a menos que acotes el lock a una sola tabla con `FOR UPDATE OF <tabla>`. TypeORM expone esto como tercer argumento de `setLock` (`lockTables`), pero inserta el alias **sin comillas**; si tu alias va en mayúsculas, Postgres lo pliega a minúsculas y no lo encuentra. Hay que pasarlo ya entrecomillado:
```ts
.setLock('pessimistic_write', undefined, [`"${this.alias}"`])
```

**Testear un método con `@Transactional()`**: el decorador necesita una `DataSource` real e inicializada para abrir una transacción — en un test unitario, mockéalo como un passthrough en vez de intentar levantar una base de datos real:
```ts
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional: () => (
    _target: unknown,
    _key: string,
    descriptor: PropertyDescriptor,
  ) => descriptor,
}));
```
La lógica de negocio de ese método sí se puede (y debe) probar con mocks normales del repositorio/otros servicios — lo único que no se puede verificar con mocks es el SQL/lock real; eso necesita un test e2e contra una base de datos real.

## Checklist rápido

- [ ] `I<X>Repository` (abstract class) extiende `IBaseTypeormRepository<X>`
- [ ] `<X>TypeormRepository` extiende `BaseTypeormRepository<X>` e implementa la interfaz
- [ ] `I<X>Service` (abstract class) con los métodos del dominio
- [ ] `<X>Service` implementa la interfaz, inyecta otras dependencias por su interfaz (nunca la clase concreta)
- [ ] Controller usa `ZodValidationPipe` + `DtoOutputInterceptor`, nunca valida/transforma a mano
- [ ] Módulo provee ambos pares `{ provide: Interfaz, useClass: Implementacion }` y exporta solo la interfaz del servicio
- [ ] Módulo registrado en el módulo padre correspondiente
- [ ] Si hay escrituras relacionadas o datos sensibles a concurrencia, se evaluó `@Transactional()` y el lock `*ForUpdate` correspondiente
