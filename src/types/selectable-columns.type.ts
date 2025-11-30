export type PrimitiveColumns = string | number | boolean | Date;

export type SelectableColumns<T> = {
  [K in keyof T]: T[K] extends PrimitiveColumns ? K : never;
}[keyof T];
