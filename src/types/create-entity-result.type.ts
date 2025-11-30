export type NewEntitySuccess<T> = { value: T; error: null };

export type NewEntityError = { value: null; error: string | string[] };

export type NewEntityResult<T> = NewEntitySuccess<T> | NewEntityError;
