import {PartialsetHandler}
  from '../../../src/Handlers/Partialset/PartialsetHandler';
import {Partialset} from '../../../src/Models/Partialset';
import {MockAxios} from '../../Utils/MockAxios';

describe('PartialsetHandler', () => {
  test('load method should not crash (name is undefined)', async () => {
    const handler = new PartialsetHandler(new Partialset({
      file: './test/Assets/Partials/school.hbs',
    }));
    await handler.load();
  });

  test('load method should not crash (specify name)', async () => {
    const handler = new PartialsetHandler(new Partialset({
      name: 'school',
      file: './test/Assets/Partials/school.hbs',
    }));
    await handler.load();
  });

  test('load method should not crash (name is null)', async () => {
    const handler = new PartialsetHandler(new Partialset({
      file: './test/Assets/Partials/school.hbs',
    }));
    await handler.load();
  });

  test('load method should not crash (multiple files)', async () => {
    const handler = new PartialsetHandler(new Partialset({
      file: './test/Assets/Partials/*.hbs',
    }));
    await handler.load();
  });

  test('load method should not crash loading multiple files', async () => {
    const handler = new PartialsetHandler(new Partialset({
      file: './test/Assets/Partials/*.hbs',
    }));
    await handler.load();
  });

  test('load method should not crash loading direct content', async () => {
    const handler = new PartialsetHandler(new Partialset({
      name: 'school',
      content: '{{school.id}}. {{school.name}}',
    }));
    await handler.load();
  });

  test('load from HTTP method should not crash', async () => {
    await MockAxios.mockUrl(
        '/school.hbs',
        './test/Assets/Partials/school.hbs');
    const handler = new PartialsetHandler(new Partialset({
      name: 'school',
      url: `/school.hbs`,
    }));
    await handler.load();
  });
});
