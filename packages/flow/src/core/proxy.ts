import Flob, { DefaultData, D } from '.';
import { GetDataType } from '../types';
import { store } from './store';

export function getFlobProxy<G extends GetDataType<DefaultData>>(flob: Flob<G>) {
  return new Proxy<D<G>>(flob.data, {
    get(_, key: string) {
      if (store.CURRENT_RUNNING_FLOW) {
        flob.addRelateFlob(key, store.CURRENT_RUNNING_FLOW);
      }

      return flob.data[key];
    }
  });
}
