# nest-ddd-pattern

Utilidades genéricas (sin ninguna dependencia del dominio de este proyecto) que sostienen el patrón de arquitectura usado aquí: entidades que se validan a sí mismas, un repositorio base de TypeORM con variantes `ReadOnly`/`ForUpdate`, inyección de dependencias por clases abstractas, validación de entrada con Zod y forma de salida con `class-transformer`.

Las skills en `.claude/skills/` (`new-entity`, `new-dto`, `new-resource`) referencian estos archivos para explicar **cómo** implementar el patrón, con ejemplos de código genéricos (no del dominio de este proyecto) dentro de las propias skills. Este directorio no se importa desde `src/` — es material de referencia.

## Cómo usarlo en un proyecto nuevo

1. Copia el contenido de `common/` y `types/` dentro del `src/` de tu proyecto nuevo (mismas rutas relativas).
2. Instala las dependencias que estas utilidades requieren: `zod`, `class-transformer`, `typeorm`, `@nestjs/common`, `@nestjs/typeorm`.
3. Configura el alias de import `src/*` en `tsconfig.json` (`paths`) y en tu config de Jest (`moduleNameMapper`) si vas a usar imports estilo `src/common/...` en vez de relativos — ver `tsconfig.json` y el bloque `jest` de `package.json` de este proyecto como referencia.
4. Usa las skills `new-entity`, `new-dto` y `new-resource` para aplicar el patrón sobre las entidades de tu nuevo dominio.

## Qué hay en cada archivo

| Archivo | Para qué sirve |
|---|---|
| `types/selectable-columns.type.ts` | Tipos auxiliares (`SelectableColumns`, `PrimitiveColumns`) que permiten pedir solo ciertas columnas en una consulta, sin perder el tipado. |
| `types/base-typeorm.repository.interface.ts` | Contrato abstracto (`IBaseTypeormRepository<TEntity>`) con las operaciones comunes de cualquier repositorio: `save`, `exists*`, `findOneById*`, `findAll*`, `findManyByIds*`, `findOneByEqual*`, `findManyByEqual*`, cada una en variante `ReadOnly` (sin lock) y `ForUpdate` (con `pessimistic_write`, para evitar race conditions). |
| `common/repositories/base-typeorm.repository.ts` | Implementación concreta de ese contrato. Cualquier repositorio de una entidad nueva extiende esta clase y solo necesita definir su `alias` — ver `new-resource`. |
| `common/exceptions/entity-validation.exception.ts` | Excepción lanzada cuando una entidad no pasa su propia validación al crearse. |
| `common/utils/validate-new-entity.ts` | Función que valida un DTO contra un schema de Zod y lanza `EntityValidationException` si falla — usada dentro del `static create()` de cada entidad. |
| `common/pipes/validation.pipe.ts` | `ZodValidationPipe`: valida el body/query de una request contra un schema de Zod, forzando `.strict()` en objetos (rechaza propiedades extra). |
| `common/interceptors/dto-output.interceptor.ts` | `DtoOutputInterceptor`: transforma la respuesta de un endpoint a través de una clase DTO decorada con `@Exclude()`/`@Expose()`, para controlar exactamente qué campos salen al cliente. |
| `common/schemas/not-empty-string.schema.ts` | Helper de Zod reutilizado por casi todos los schemas de entrada (`z.string().trim().min(1)`). |

Estas piezas son completamente genéricas — no referencian ninguna entidad de negocio. El patrón de **cómo conectarlas** (entidad validada, repositorio, servicio, controller, DTOs) está documentado con ejemplos neutrales dentro de las skills, no en este directorio.
