import {IDataset} from './IDataset';
import {IIterator} from './IIterator';
import {IHelperset} from './IHelperset';
import {IPartialset} from './IPartialset';

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
  partials?: IPartialset[] | string[] | string | undefined;
  helpers?: IHelperset[] | string[] | string | undefined;
}
