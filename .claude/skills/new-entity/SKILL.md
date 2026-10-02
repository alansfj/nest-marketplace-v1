---
name: new-entity
description: Crea una nueva entidad de TypeORM siguiendo el patrón de este proyecto (constructor privado + static create() validado con Zod + __brand para nominal typing). Usar cuando el usuario pida agregar una nueva entidad/tabla o un nuevo campo a la forma de creación de una entidad existente.
---

# Crear una entidad siguiendo el patrón del proyecto

Este proyecto nunca permite `new Entidad()` con datos sueltos. Toda entidad nace validada. Sigue este patrón exactamente — los archivos de referencia son `src/entities/order.entity.ts` y `src/entities/order-item.entity.ts` (relación con otras entidades) y `src/entities/product.entity.ts`.

## Pasos

1. **Definir el schema de creación** con Zod, al inicio del archivo:
   ```ts
   const newEntitySchema = z.object({
     campoTexto: nonEmptyStringSchema(), // de src/common/schemas/not-empty-string.schema.ts
     precio: z.number().gt(0),
     cantidad: z.number().int().positive(),
     moneda: z.nativeEnum(Currency),
     // referencia a otra entidad -> validar por __brand + id, NUNCA aceptar el objeto completo sin chequeo
     otraEntidad: z.object({
       __brand: z.literal('NombreDeLaOtraEntidad'),
       id: z.number().int().positive(),
     }),
   });

   type newEntityDto = Required<z.infer<typeof newEntitySchema>>;
   ```

2. **Exportar nombre y alias de tabla** (el alias siempre en mayúsculas, se usa luego en el repositorio):
   ```ts
   export const TABLE_NAME_X = 'nombre_tabla';
   export const TABLE_ALIAS_X: Uppercase<typeof TABLE_NAME_X> = 'ALIAS_MAYUSCULAS';
   ```

3. **Declarar la clase** con constructor privado y el campo `__brand`:
   ```ts
   @Entity(TABLE_NAME_X)
   export class X {
     @Exclude()
     readonly __brand = 'X'; // debe coincidir con el literal usado en schemas de OTRAS entidades que referencien a X

     private constructor(dto: newEntityDto) {
       Object.assign(this, dto);
     }

     @PrimaryGeneratedColumn()
     readonly id: number;

     // ... columnas con @Column(), relaciones con @ManyToOne/@OneToMany

     @CreateDateColumn() readonly createdDate: Date;
     @UpdateDateColumn() readonly updatedDate: Date;
     @DeleteDateColumn() readonly deletedDate: Date; // soft delete, siempre presente

     static create(dto: newEntityDto): X {
       validateNewEntity('X', newEntitySchema, dto);
       return new X(dto);
     }
   }
   ```

4. **Columnas de dinero**: usar siempre
   ```ts
   @Column({ type: 'numeric', precision: 11, scale: MONEY_SCALE, nullable: false })
   precio: string;
   ```
   (`MONEY_SCALE` de `src/common/constants/money-scale.ts`). Nunca `number` para dinero en la entidad — se opera con el value object `Money` (`src/common/value-objects/money.ts`) en el servicio, y se guarda como string.

5. **Tipo de columnas seleccionables**: exportar también
   ```ts
   export type XSelectableColumns = SelectableColumns<X>;
   ```
   (se usa en los métodos `*ReadOnly` del repositorio para pedir solo ciertas columnas).

6. Después de crear/modificar la entidad, generar la migración:
   ```bash
   npm run migration:generate -- migrations/<NombreDescriptivo>
   npm run migration:run
   ```
   Revisa el SQL generado antes de correrlo — a veces TypeORM agrega cambios no intencionados si otras entidades quedaron desincronizadas.

## Errores comunes a evitar

- Olvidar el `__brand` cuando otra entidad necesita referenciar a esta en su `newEntitySchema` — sin él, cualquier objeto con `id` pasaría la validación.
- Usar `number` en vez de `string` para columnas de dinero.
- No agregar `@DeleteDateColumn()` — rompe el soft delete que el resto del proyecto asume.
