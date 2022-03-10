import {IDataset} from './IDataset';
import {IHelperset} from './IHelperset';
import {IPartialset} from './IPartialset';
import {ITemplate} from './ITemplate';

export interface IBebar {
  data?: (IDataset | string)[] | string | undefined;
  partials?: (IPartialset | string)[] | string | undefined;
  helpers?: (IHelperset | string)[] | string | undefined;
  templates?: ITemplate[] | undefined;
}
