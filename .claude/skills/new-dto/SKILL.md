---
name: new-dto
description: Crea los DTOs de entrada (Zod schema) y salida (class-transformer) para un endpoint, siguiendo el patrón de este proyecto. Usar cuando el usuario pida agregar un nuevo endpoint o cambiar la forma de entrada/salida de uno existente.
---

# Crear DTOs de entrada y salida siguiendo el patrón del proyecto

Este proyecto **no** usa `class-validator` para el input ni serializa el output "a mano". Usa Zod para validar entrada y `class-transformer` para controlar exactamente qué sale en la respuesta.

## DTO de entrada

Referencia: `src/common/schemas/add-item-to-order.schema.ts` + `src/modules/order/dtos/add-item-to-order.dto.input.ts`.

1. Crear el schema de Zod en `src/common/schemas/<accion>.schema.ts`:
   ```ts
   import { z } from 'zod';

   export const xActionSchema = z.object({
     campo: z.number().int().positive(),
     texto: nonEmptyStringSchema(), // reusar helpers existentes en common/schemas cuando apliquen
   });
   ```

2. El DTO de input es solo un tipo derivado, en `src/modules/<modulo>/dtos/<accion>.dto.input.ts`:
   ```ts
   import { z } from 'zod';
   import { xActionSchema } from 'src/common/schemas/x-action.schema';

   export type XActionDtoInput = Required<z.infer<typeof xActionSchema>>;
   ```

3. En el controller, validar con el pipe existente (NO crear uno nuevo):
   ```ts
   @Post()
   xAction(
     @UserInReq() user: IAuthUser,
     @Body(new ZodValidationPipe(xActionSchema)) dto: XActionDtoInput,
   ) {
     return this.xService.xAction(user.id, dto);
   }
   ```
   `ZodValidationPipe` (`src/common/pipes/validation.pipe.ts`) aplica `.strict()` automáticamente a objetos, así que cualquier propiedad extra en el body ya es rechazada sin hacer nada adicional.

## DTO de salida

Referencia: `src/modules/order/dtos/add-item-to-order.dto.output.ts` (incluye un DTO anidado) y `src/modules/store/dtos/create-store.dto.output.ts`.

1. Crear la clase en `src/modules/<modulo>/dtos/<accion>.dto.output.ts`:
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
   Regla clave: `@Exclude()` a nivel de clase + `@Expose()` por campo. Cualquier campo de la entidad que no tenga `@Expose()` nunca llega al cliente, aunque el servicio lo devuelva.

2. En el controller, aplicar el interceptor existente (NO escribir lógica de transformación manual):
   ```ts
   @Post()
   @UseInterceptors(new DtoOutputInterceptor(XActionDtoOutput))
   xAction(...) { ... }
   ```

3. Si la entidad que se devuelve tiene una referencia circular (ej. `order.orderItems[].order` vuelve a apuntar a `order`), hay que romperla en el servicio antes de retornar — revisa cómo lo hace `OrderService.addItemToOrder` (`src/modules/order/order.service.ts`) asignando `order: undefined` dentro del item mapeado. Si no se rompe, el interceptor puede fallar o entrar en un loop al serializar.

## Checklist rápido

- [ ] Schema Zod en `src/common/schemas/`, reusando helpers (`nonEmptyStringSchema`, etc.) cuando exista uno que aplique
- [ ] DTO input = tipo derivado del schema, no una clase
- [ ] DTO output = clase con `@Exclude()` + `@Expose()`, nested objects con su propio DTO + `@Type()`
- [ ] Controller usa `ZodValidationPipe` y `DtoOutputInterceptor` existentes, no helpers nuevos
- [ ] Si hay relaciones circulares en el output, se rompen antes de devolver la respuesta
