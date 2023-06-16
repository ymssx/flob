import Flob, { DefaultData } from './core/index';
import { GetDataType } from './types/index';

export default function getFlob<G extends GetDataType<DefaultData>>(getData: G) {
  return new Flob<G>(getData);
}
