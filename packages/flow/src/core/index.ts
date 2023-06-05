import { GetDataType } from '../types/index';
import { getFlowProxy } from './proxy';
import { store } from './store';

export default class Flow<D extends Object> {
  _value: D;

  _getData: GetDataType<D>;

  relateFlows: {
    [key in keyof D]?: Set<Flow<Object>>
  } = {};

  constructor(getData: GetDataType<D>) {
    this._getData = getData;
    this.updateData();
  }

  async updateData() {
    if (this._getData instanceof Function) {
      store.CURRENT_RUNNING_FLOW = this;
      const newData = this._getData();
      if (newData instanceof Promise) {
        this._value = await newData;
      } else {
        this._value = newData;
      }
      store.CURRENT_RUNNING_FLOW = undefined;
    } else {
      this._value = this._getData;
    }
  }

  addRelateFlow(key: string, flow: Flow<Object>) {
    if (!this.relateFlows[key]) {
      this.relateFlows[key] = new Set();
    }
    this.relateFlows[key]?.add(flow);
  }

  update(key: string, value: any) {
    console.log('update from', key, value);
    this.updateData();
  }

  get() {
    return getFlowProxy(this);
  }

  set(newData: Partial<D>) {
    this._value = {
      ...this._value,
      ...newData,
    };
    for (const key in newData) {
      const relateFlows = this.relateFlows[key];
      if (relateFlows) {
        relateFlows.forEach(item => item.update(key, newData[key]));
      }
    }
  }

  on() {}
}
