import {HelpersetHandler}
  from '../../../src/Handlers/Helperset/HelpersetHandler';
import {Helperset} from '../../../src/Models/Helperset';
import {MockAxios} from '../../Utils/MockAxios';
import Handlebars from 'handlebars';
import {BebarHandlerContext} from '../../../src/Handlers/Bebar/BebarHandlerContext';

describe('HelpersetHandler', () => {
  it('load method should not crash', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/Assets/Helpers/stringHelpers.js',
    }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });

  it('load method should not crash loading multiple files', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/Assets/Helpers/*.js',
    }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });

  it('load from HTTP method should not crash', async () => {
    await MockAxios.mockUrl(
        '/stringHelpers.js',
        './test/Assets/Helpers/stringHelpers.js');
    const handler = new HelpersetHandler(new Helperset({
      url: '/stringHelpers.js',
    }), Handlebars.create());
    await handler.load(new BebarHandlerContext('.', 'do.bebar', Handlebars.create()));
  });
});
