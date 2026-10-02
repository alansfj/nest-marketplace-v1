# nest-marketplace-v1

Backend de un ecommerce/marketplace construido con NestJS como proyecto personal de aprendizaje de programación backend. El objetivo no es solo "que funcione", sino practicar patrones de arquitectura (DDD ligero, repository pattern, DI por contratos) de forma consistente en todo el código.

## Stack

- **Framework**: NestJS 10 + Express
- **DB**: PostgreSQL vía TypeORM 0.3 (query builder, no `find()` mágico)
- **Transacciones**: `typeorm-transactional` (decorador `@Transactional()`)
- **Validación de entrada**: Zod (no `class-validator`)
- **Serialización de salida**: `class-transformer` (`@Exclude`/`@Expose`)
- **Auth**: Passport (`passport-jwt`, `passport-local`) + `@nestjs/jwt`
- **Dinero**: `decimal.js` envuelto en un value object propio (`Money`) — nunca operar dinero con `number`/`string` nativos
- **Tests**: Jest (actualmente sin specs propios, solo el e2e por defecto)

## Comandos

```bash
npm run start:dev          # servidor con watch
npm run build               # nest build (usar para validar que compila)
npm run lint                 # eslint --fix
npm run format                # prettier --write
npm run test                   # jest unit
npm run test:e2e                # jest e2e

npm run migration:generate    # genera migración desde cambios en entidades
npm run migration:run          # aplica migraciones pendientes
npm run migration:revert        # revierte la última
```

La base de datos corre en Docker (`docker-compose.yml`, servicio `postgres-db`). Variables en `.env` (ver `.env.template`).

## Arquitectura de un módulo

Cada dominio (`order`, `product`, `store`, `category`, ...) vive en `src/modules/<nombre>/` con esta forma, usando `order-item` y `category` como referencias (el primero es el más completo, el segundo el más simple):

```
src/modules/<nombre>/
  <nombre>.module.ts
  <nombre>.controller.ts
  <nombre>.service.ts            # implementa I<Nombre>Service
  <nombre>.repository.ts         # implementa I<Nombre>Repository, extiende BaseTypeormRepository<Entity>
  dtos/
    <accion>.dto.input.ts
    <accion>.dto.output.ts

src/types/<nombre>/
  <nombre>.service.interface.ts   # abstract class I<Nombre>Service
  <nombre>.repository.interface.ts # abstract class I<Nombre>Repository
```

### Inyección de dependencias por contrato (clave del proyecto)

TypeScript borra las `interface` en runtime, así que Nest no puede inyectar por interfaz. Este proyecto resuelve eso con **clases abstractas** usadas como tokens de DI:

- `src/types/<nombre>/<nombre>.service.interface.ts` define `export abstract class I<Nombre>Service { abstract metodo(...): Promise<T>; }`
- La implementación concreta (`<Nombre>Service`) la implementa con `implements I<Nombre>Service`
- El módulo la registra así:
  ```ts
  providers: [
    { provide: I<Nombre>Service, useClass: <Nombre>Service },
    { provide: I<Nombre>Repository, useClass: <Nombre>TypeormRepository },
  ],
  exports: [I<Nombre>Service],  // se exporta la interfaz, nunca la clase concreta
  ```
- Otros servicios/controladores inyectan `private readonly algo: I<Nombre>Service` (nunca la clase concreta) por constructor.

Ejemplo real: `OrderService` (`src/modules/order/order.service.ts`) inyecta `IUserService`, `IProductService` e `IOrderItemService` — nunca sus implementaciones.

### Repositorios (`BaseTypeormRepository<TEntity>`)

`src/common/repositories/base-typeorm.repository.ts` centraliza las operaciones comunes. Cada método viene en dos variantes:

- `...ReadOnly`: sin lock, acepta `select: SelectableColumns<TEntity>[]` para pedir solo columnas específicas (devuelve `Pick<TEntity, T>`)
- `...ForUpdate`: usa `setLock('pessimistic_write')` — usar siempre que la fila se vaya a modificar dentro de una transacción, para evitar race conditions (dos requests leyendo el mismo stock antes de que ninguna termine de escribir)

Métodos base: `save`, `existsById`, `existsByEqual`, `findOneById{ReadOnly,ForUpdate}`, `findAll{ReadOnly,ForUpdate}`, `findManyByIds{ReadOnly,ForUpdate}`, `findOneByEqual{ReadOnly,ForUpdate}`, `findManyByEqual{ReadOnly,ForUpdate}`.

Un repositorio concreto solo necesita:
```ts
export class XxxTypeormRepository extends BaseTypeormRepository<Xxx> implements IXxxRepository {
  protected readonly alias = TABLE_ALIAS_XXX; // ej. 'ORDERS', mayúsculas
  constructor(@InjectRepository(Xxx) repo: Repository<Xxx>) { super(repo); }
  // métodos custom usan this.qb() (query builder con el alias ya puesto) y this.alias
}
```

**Gotcha de locking + joins**: `setLock('pessimistic_write')` con un `LEFT JOIN` falla en Postgres ("no se puede bloquear el lado nullable de un outer join") a menos que se acote con `FOR UPDATE OF <tabla>`. TypeORM expone esto como tercer argumento de `setLock` (`lockTables`), pero inserta el alias **sin comillas** — como los alias de este proyecto van en mayúsculas, Postgres los pliega a minúsculas y no los encuentra. Hay que pasarlos ya entrecomillados: `setLock('pessimistic_write', undefined, [\`"${this.alias}"\`])`. Ver `src/modules/product/product.repository.ts` (`findOneByIdForUpdateWithOwner`).

### Entidades

Patrón en todas las entidades (`src/entities/*.entity.ts`, ej. `order.entity.ts`, `product.entity.ts`):

- Constructor **privado**; la única forma de crear una instancia nueva es `Entity.create(dto)`
- `static create(dto)` valida `dto` contra un `newEntitySchema` de Zod (vía `validateNewEntity` de `src/common/utils/validate-new-entity.ts`) y lanza `EntityValidationException` si falla, antes de construir el objeto
- Campo `@Exclude() readonly __brand = 'NombreEntidad'` — nominal typing para que, cuando una entidad A referencia a otra B en su schema de creación, el schema pueda validar `z.object({ __brand: z.literal('B'), id: ... })` y así asegurarse de que realmente le pasaron un `B` y no cualquier objeto con `id`
- Columnas de dinero: `{ type: 'numeric', precision: 11, scale: MONEY_SCALE, nullable: false }` — se guardan como string, nunca como `number` nativo (evita errores de precisión de floats)
- Soft delete con `@DeleteDateColumn()` en todas las entidades
- Exportan `TABLE_NAME_X` y `TABLE_ALIAS_X` (alias en mayúsculas) como constantes usadas por el repositorio

### Value object `Money`

`src/common/value-objects/money.ts`. Envuelve `decimal.js`. Cualquier suma/resta/multiplicación de precios, subtotales o totales debe pasar por `Money.from(...)`, nunca hacerse con operadores aritméticos sobre `number`/`string` directamente.

### DTOs

**Input**: no hay clases decoradas con `class-validator`. El schema de Zod vive en `src/common/schemas/<accion>.schema.ts`, y el DTO de input es solo un alias de tipo derivado:
```ts
export type XDtoInput = Required<z.infer<typeof xSchema>>;
```
En el controller se valida con `@Body(new ZodValidationPipe(xSchema)) dto: XDtoInput` (el pipe fuerza `.strict()` en objetos, rechazando propiedades extra).

**Output**: clases con `class-transformer`:
```ts
@Exclude()
export class XDtoOutput {
  @Expose() id: number;
  @Expose() @Type(() => NestedDto) nested: NestedDto;
}
```
Se aplican con `@UseInterceptors(new DtoOutputInterceptor(XDtoOutput))` sobre el handler del controller — el interceptor hace `instanceToPlain(plainToClass(dto, data))`, así que cualquier campo sin `@Expose()` se descarta de la respuesta aunque la entidad lo tenga.

Si una entidad se serializa dentro de otra con relación circular (p. ej. `order.orderItems[].order` apunta de vuelta a `order`), hay que romper la referencia antes de devolver la respuesta — ver `OrderService.addItemToOrder`.

### Auth

- `@UserInReq()` (`src/common/decorators/user-in-req.decorator.ts`) lee `req.user`, puesto ahí por las estrategias de Passport
- Guard JWT global registrado en `app.module.ts` vía `APP_GUARD`; rutas públicas se marcan con `@Public()` (`src/common/decorators/is-public.decorator.nest.ts`)

### Transacciones y concurrencia

- `@Transactional()` (de `typeorm-transactional`) en métodos de servicio que hacen múltiples escrituras relacionadas
- Combinar con `...ForUpdate` del repositorio cuando la operación depende de un valor que otra request concurrente podría cambiar (stock, balance, etc.)
- El carrito (`status: CART`) **no** descompromete stock al agregar items — es solo una intención de compra. El stock real solo se descuenta (y necesita lock) en el futuro flujo de checkout/confirmación de compra, que aún no existe.

## Dónde mirar para ejemplos completos

- Módulo más completo y reciente: `src/modules/order` + `src/modules/order-item` (entidad validada, repo con query custom, servicio con lógica de negocio, DTOs con relación anidada)
- Módulo más simple para copiar la estructura mínima: `src/modules/category`
