export type NewEntitySuccess<T> = { value: T; errors: null };

export type NewEntityError = { value: null; errors: string[] };

export type NewEntityResult<T> = NewEntitySuccess<T> | NewEntityError;
