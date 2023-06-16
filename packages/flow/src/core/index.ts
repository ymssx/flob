import { GetDataType } from '../types/index';
import { getFlobProxy } from './proxy';
import { store } from './store';

export type DefaultData = Record<string, any>;

/**
 * 自定义类型守卫函数
 */
function isFunction(func: any): func is Function {
  return typeof func === 'function';
}
function isPromise(obj: any): obj is Promise<any> {
  return obj instanceof Promise;
}

function afterUpdate<G extends GetDataType<DefaultData>, E>(flob: Flob<G>, callback: () => E): PD<G, E> {
  const updateRes = flob.updateData();
  if (isPromise(updateRes)) {
    return updateRes.then(() => callback()) as PD<G, E>; 
  }
  return callback() as PD<G, E>;
}

export type D<G extends GetDataType<DefaultData>> = G extends GetDataType<infer D>
  ? D extends Promise<infer PD>
    ? PD
    : D
  : never;

export type PD<G extends GetDataType<DefaultData>, R = D<G>> = G extends (...args: any[]) => Promise<any> ? Promise<R> : R;

export default class Flob<
  G extends GetDataType<DefaultData> = GetDataType<DefaultData>,
> {
  _data: D<G> | null = null;

  _getData: G;

  relateFlobs: Record<string, Set<Flob>> = {};

  constructor(getData: G) {
    this._getData = getData;
    // this.updateData();
  }

  updateData() {
    const getDataFunc = this._getData;
    if (isFunction(getDataFunc)) {
      store.CURRENT_RUNNING_FLOW = this;
      const newData = getDataFunc();
      if (isPromise(newData)) {
        return newData
          .then((res) => {
            this._data = res;
          })
          .finally(() => {
            store.CURRENT_RUNNING_FLOW = undefined;
          });
      } else {
        this._data = newData;
        store.CURRENT_RUNNING_FLOW = undefined;
      }
    } else if (!this._data) {
      this._data = getDataFunc as D<G>;
    }
    return;
  }

  addRelateFlob(key: string, flob: Flob) {
    if (!this.relateFlobs[key]) {
      this.relateFlobs[key] = new Set();
    }
    this.relateFlobs[key]?.add(flob);
  }

  update(key: string, value: any) {
    console.log('update from', key, value);
    this.updateData();
  }

  /**
   * 输出一个可靠的data数据，如果没有被初始化，那么会直接报错
   * 通过这种方式引入data，不会记录依赖关系
   */
  public get data() {
    if (!this._data) {
      throw new Error('this data has not init');
    }
    return this._data;
  }

  get() {
    return afterUpdate<G, D<G>>(this, () => getFlobProxy(this));
  }

  set(newData: Partial<D<G>>) {
    return afterUpdate<G, D<G>>(this, () => {
      this._data = {
        ...this.data,
        ...newData,
      };
      for (const key in newData) {
        const relateFlobs = this.relateFlobs[key];
        if (relateFlobs) {
          relateFlobs.forEach(item => item.update(key, newData[key]));
        }
      }
      return this.data;
    });
  }

  on() {}
}
