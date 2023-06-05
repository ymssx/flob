import Flow from './core/index';
import { GetDataType } from './types/index';

export default function getFlow<D extends Object>(getData: GetDataType<D>) {
  return new Flow<D>(getData);
}
