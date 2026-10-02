---
name: new-entity
description: Crea una nueva entidad de TypeORM siguiendo el patrón de "entidad validada" (constructor privado + static create() validado con Zod + __brand para nominal typing), independiente del dominio del proyecto. Usar cuando el usuario pida agregar una nueva entidad/tabla, o un nuevo campo a la forma de creación de una entidad existente.
---

# Crear una entidad siguiendo el patrón de "entidad validada"

Este patrón nunca permite `new Entidad()` con datos sueltos — toda entidad nace validada contra un schema de Zod, dentro de su propio `static create()`.

Las utilidades de soporte viven en `docs/nest-ddd-pattern/common/` de este proyecto:
- `docs/nest-ddd-pattern/common/utils/validate-new-entity.ts` — valida un dto contra un schema de Zod y lanza `EntityValidationException` si falla.
- `docs/nest-ddd-pattern/common/exceptions/entity-validation.exception.ts` — la excepción que lanza.
- `docs/nest-ddd-pattern/common/schemas/not-empty-string.schema.ts` — helper `nonEmptyStringSchema()` reusado en casi todos los schemas.
- `docs/nest-ddd-pattern/types/selectable-columns.type.ts` — tipo `SelectableColumns<T>` usado en el paso 5.

Si estás en OTRO proyecto, copia esos archivos a tu `src/` primero (ver `docs/nest-ddd-pattern/README.md`).

## Pasos

1. **Definir el schema de creación** con Zod, al inicio del archivo de la entidad:
   ```ts
   const newEntitySchema = z.object({
     campoTexto: nonEmptyStringSchema(),
     cantidad: z.number().int().positive(),

     // Referencia a OTRA entidad: validar por __brand + id, NUNCA aceptar
     // el objeto completo sin este chequeo. Así te asegura que de verdad
     // te pasaron una instancia de Y, no cualquier objeto con un `id`.
     y: z.object({
       __brand: z.literal('Y'),
       id: z.number().int().positive(),
     }),
   });

   type newEntityDto = Required<z.infer<typeof newEntitySchema>>;
   ```

2. **Exportar nombre y alias de tabla** (alias siempre en mayúsculas — lo usa el repositorio, ver la skill `new-resource`):
   ```ts
   export const TABLE_NAME_X = 'x_table_name';
   export const TABLE_ALIAS_X: Uppercase<typeof TABLE_NAME_X> = 'X_ALIAS';
   ```

3. **Declarar la clase** con constructor privado y el campo `__brand`:
   ```ts
   @Entity(TABLE_NAME_X)
   export class X {
     @Exclude()
     readonly __brand = 'X'; // debe coincidir con el literal que OTRAS entidades usan para referenciar a X

     private constructor(dto: newEntityDto) {
       Object.assign(this, dto);
     }

     @PrimaryGeneratedColumn()
     readonly id: number;

     // ... columnas con @Column(), relaciones con @ManyToOne/@OneToMany

     @CreateDateColumn() readonly createdDate: Date;
     @UpdateDateColumn() readonly updatedDate: Date;
     @DeleteDateColumn() readonly deletedDate: Date; // soft delete, si el resto del proyecto lo usa

     static create(dto: newEntityDto): X {
       validateNewEntity('X', newEntitySchema, dto);
       return new X(dto);
     }
   }
   ```

4. **Columnas que requieren precisión exacta** (dinero, medidas, porcentajes...): guárdalas como `string` en la entidad y en la base de datos (`type: 'numeric'` en Postgres), nunca `number` nativo — un `number` de JS pierde precisión en operaciones aritméticas repetidas. Encapsula las operaciones en un *value object* en vez de manipular el string/number directamente en los servicios (ver sección siguiente).

5. **Tipo de columnas seleccionables**: exportar también
   ```ts
   export type XSelectableColumns = SelectableColumns<X>;
   ```
   (se usa en los métodos `*ReadOnly` del repositorio para pedir solo ciertas columnas — ver `new-resource`).

6. Después de crear/modificar la entidad, generar y **revisar** la migración antes de correrla — a veces el generador de migraciones agrega cambios no intencionados si otras entidades quedaron desincronizadas.

## Value objects (opcional, cuando el dominio lo requiera)

Si un campo tiene reglas de negocio no triviales (dinero, coordenadas, rangos de fecha...), envuélvelo en una clase inmutable con operaciones nombradas en vez de manipular el primitivo directamente en los servicios. Ejemplo genérico de un value object de dinero con precisión decimal exacta (usando `decimal.js`, ya que los `number` de JS no son seguros para aritmética de dinero):

```ts
import Decimal from 'decimal.js';

export class Money {
  private readonly value: Decimal;
  private static readonly SCALE = 2;

  private constructor(value: Decimal) {
    this.value = value;
  }

  static from(value: string | number | Decimal): Money {
    return new Money(new Decimal(value));
  }

  static zero(): Money {
    return new Money(new Decimal(0));
  }

  add(amount: Money): Money {
    return new Money(this.value.plus(amount.value));
  }

  subtract(amount: Money): Money {
    return new Money(this.value.minus(amount.value));
  }

  multiply(factor: number | string | Decimal): Money {
    return new Money(this.value.times(factor));
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  isGreaterThan(amount: Money): boolean {
    return this.value.gt(amount.value);
  }

  toString(): string {
    return this.value.toFixed(Money.SCALE);
  }
}
```
Este mismo molde (constructor privado + `static from()`/`static zero()` + operaciones nombradas que devuelven una nueva instancia + `toString()`) aplica a cualquier otro valor con reglas propias — no solo dinero.

## Errores comunes a evitar

- Olvidar el `__brand` cuando otra entidad necesita referenciar a esta en su `newEntitySchema` — sin él, cualquier objeto con `id` pasaría la validación.
- Usar `number` nativo para columnas que requieren precisión decimal exacta.
- No agregar `@DeleteDateColumn()` si el resto del proyecto asume soft delete en todas las entidades.
