export type GetDataType<D extends Object> = D | (() => Promise<D>) | (() => D);
