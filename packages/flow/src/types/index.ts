import { DefaultData } from "../core";

export type GetDataType<D extends DefaultData> = D | (() => Promise<D>) | (() => D);
