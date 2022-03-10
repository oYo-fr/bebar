import {IDataset} from './IDataset';
import {IHelperset} from './IHelperset';
import {IPartialset} from './IPartialset';
import {ITemplate} from './ITemplate';

export interface IBebar {
  data?: (IDataset | string)[] | IDataset | string | undefined;
  partials?: (IPartialset | string)[] | IPartialset | string | undefined;
  helpers?: (IHelperset | string)[] | IHelperset |string | undefined;
  templates?: ITemplate[] | ITemplate | undefined;
}
