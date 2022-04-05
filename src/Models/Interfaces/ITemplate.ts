import {IDataset} from './IDataset';
import {IIterator} from './IIterator';
import {IHelperset} from './IHelperset';
import {IPartialset} from './IPartialset';

export interface ITemplate {
  name?: string | undefined;
  file?: string | undefined;
  encoding?: string | undefined;
  url?: string | undefined;
  httpOptions?: any | undefined;
  content?: string | undefined;
  data?: (IDataset | string)[] | IDataset | string | undefined;
  output?: string | undefined;
  iterators?: (IIterator | string)[] | IIterator | string | undefined;
  iterationValueName?: string | undefined;
  prettify?: any | undefined;
  partials?: (IPartialset | string)[] | IPartialset | string | undefined;
  helpers?: (IHelperset | string)[] | IHelperset | string | undefined;
}
