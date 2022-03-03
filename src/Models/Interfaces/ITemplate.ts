import {IDataset} from './IDataset';
import {IIterator} from './IIterator';

export interface ITemplate {
  file?: string | undefined;
  encoding?: string | undefined;
  url?: string | undefined;
  httpOptions?: any | undefined;
  content?: string | undefined;
  data?: IDataset[] | string[] | string | undefined;
  output?: string | undefined;
  iterators?: IIterator[] | undefined;
  iterationValueName?: string | undefined;
  prettify?: any | undefined;
}
