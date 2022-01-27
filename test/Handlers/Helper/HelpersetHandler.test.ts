import {HelpersetHandler}
  from '../../../src/Handlers/Helper/HelpersetHandler';
import {Helperset} from '../../../src/Models/Helperset';
import {MockAxios} from '../../Utils/MockAxios';

describe('HelpersetHandler', () => {
  test('load method should not crash', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/Assets/Helpers/stringHelpers.js',
    }));
    await handler.load();
  });

  test('load method should not crash loading multiple files', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/Assets/Helpers/*.js',
    }));
    await handler.load();
  });

  test('load from HTTP method should not crash', async () => {
    await MockAxios.mockUrl(
        '/stringHelpers.js',
        './test/Assets/Helpers/stringHelpers.js');
    const handler = new HelpersetHandler(new Helperset({
      url: '/stringHelpers.js',
    }));
    await handler.load();
  });
});
