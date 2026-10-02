---
name: new-dto
description: Crea los DTOs de entrada (Zod schema) y salida (class-transformer) para un endpoint, independiente del dominio del proyecto. Usar cuando el usuario pida agregar un nuevo endpoint o cambiar la forma de entrada/salida de uno existente.
---

# Crear DTOs de entrada y salida

Este patrón **no** usa `class-validator` para el input ni serializa el output "a mano". Usa Zod para validar entrada y `class-transformer` para controlar exactamente qué sale en la respuesta.

Las utilidades de soporte viven en `docs/nest-ddd-pattern/common/` de este proyecto:
- `docs/nest-ddd-pattern/common/pipes/validation.pipe.ts` — `ZodValidationPipe`.
- `docs/nest-ddd-pattern/common/interceptors/dto-output.interceptor.ts` — `DtoOutputInterceptor`.

Si estás en OTRO proyecto, copia esos dos archivos a tu `src/` primero (ver `docs/nest-ddd-pattern/README.md`).

## DTO de entrada

1. Crear el schema de Zod:
   ```ts
   import { z } from 'zod';

   export const xActionSchema = z.object({
     campo: z.number().int().positive(),
     texto: nonEmptyStringSchema(), // reusa helpers existentes del proyecto cuando apliquen
   });
   ```

2. El DTO de input es solo un tipo derivado, **nunca una clase**:
   ```ts
   import { z } from 'zod';
   import { xActionSchema } from './x-action.schema';

   export type XActionDtoInput = Required<z.infer<typeof xActionSchema>>;
   ```

3. En el controller, validar con `ZodValidationPipe` (NO crear un pipe nuevo):
   ```ts
   @Post()
   xAction(
     @Body(new ZodValidationPipe(xActionSchema)) dto: XActionDtoInput,
   ) {
     return this.xService.xAction(dto);
   }
   ```
   El pipe aplica `.strict()` automáticamente a objetos, así que cualquier propiedad extra en el body ya es rechazada sin hacer nada adicional.

4. **Query params numéricos** (paginación, filtros): usa `z.coerce.number()` en vez de `z.number()` — los query params siempre llegan como string desde HTTP, nunca como número nativo:
   ```ts
   export const listXSchema = z.object({
     limit: z.coerce.number().int().positive().max(100).optional().default(20),
     offset: z.coerce.number().int().min(0).optional().default(0),
   });
   ```
   Con `@Query(new ZodValidationPipe(listXSchema)) dto: ListXDtoInput` en el controller.

## DTO de salida

1. Crear la clase:
   ```ts
   import { Exclude, Expose, Type } from 'class-transformer';

   @Exclude()
   export class XActionDtoOutput {
     @Expose()
     id: number;

     @Expose()
     campo: string;

     // relación anidada: declarar un DTO propio para el objeto anidado y usar @Type
     @Expose()
     @Type(() => NestedDtoOutput)
     relacion: NestedDtoOutput;
   }
   ```
   Regla clave: `@Exclude()` a nivel de clase + `@Expose()` por campo. Cualquier campo de la entidad/servicio que no tenga `@Expose()` nunca llega al cliente, aunque exista en el objeto real.

2. En el controller, aplicar `DtoOutputInterceptor` (NO escribir lógica de transformación manual):
   ```ts
   @Post()
   @UseInterceptors(new DtoOutputInterceptor(XActionDtoOutput))
   xAction(...) { ... }
   ```

3. **Referencias circulares**: si lo que devuelve el servicio tiene una entidad que apunta de vuelta a sí misma a través de otra (ej. `a.items[].a` vuelve a apuntar a `a`), rómpela en el servicio antes de retornar — por ejemplo reasignando `item.a = undefined` dentro del array mapeado. Si no se rompe, el interceptor puede fallar o entrar en un loop infinito al serializar.

## Checklist rápido

- [ ] Schema Zod, reusando helpers existentes (`nonEmptyStringSchema`, etc.) cuando exista uno que aplique
- [ ] DTO input = tipo derivado del schema, nunca una clase
- [ ] Query params numéricos usan `z.coerce.number()`, no `z.number()`
- [ ] DTO output = clase con `@Exclude()` + `@Expose()`, nested objects con su propio DTO + `@Type()`
- [ ] Controller usa `ZodValidationPipe` y `DtoOutputInterceptor` existentes, no helpers nuevos
- [ ] Si hay relaciones circulares en el output, se rompen antes de devolver la respuesta
