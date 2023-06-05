import Flow from ".";
import { store } from './store';

export function getFlowProxy<D extends Object>(flow: Flow<D>) {
  return new Proxy(flow, {
    get(target, key: string) {
      if (store.CURRENT_RUNNING_FLOW) {
        target.addRelateFlow(key, store.CURRENT_RUNNING_FLOW);
      }

      return target._value[key];
    }
  });
}
