import {IDataset} from './IDataset';
import {IHelperset} from './IHelperset';
import {IPartialset} from './IPartialset';
import {ITemplate} from './ITemplate';

export interface IBebar {
  data: IDataset[] | undefined;
  partials: IPartialset[] | undefined;
  helpers: IHelperset[] | undefined;
  templates: ITemplate[] | undefined;
}
