export type PrimitiveColumns = string | number | boolean | Date;

type SelectablePrimitiveColumns<T> = {
  [K in keyof T]: T[K] extends PrimitiveColumns ? K : never;
}[keyof T];

export type SelectableColumns<T> = Extract<
  Exclude<SelectablePrimitiveColumns<T>, '__brand'>,
  string
>;
