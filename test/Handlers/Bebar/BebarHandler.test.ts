import {BebarHandler}
  from '../../../src/Handlers/Bebar/BebarHandler';
import {Bebar} from '../../../src/Models/Bebar';

describe('BebarHandler', () => {
  it('load method should not crash', async () => {
    const handler = new BebarHandler(new Bebar({
      data: [{file: './test/Assets/Datasets/*.yaml'}],
      partials: [{file: './test/Assets/Partials/*.hbs'}],
      helpers: [{file: './test/Assets/Helpers/*.js'}],
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length > 0).toBeTruthy();
    expect(handler.templateHandlers[0].outputs[0].content === '').toBeFalsy();
  });

  it('load method should not crash with direct arrays', async () => {
    const handler = new BebarHandler(new Bebar({
      data: ['./test/Assets/Datasets/*.yaml'],
      partials: ['./test/Assets/Partials/*.hbs'],
      helpers: ['./test/Assets/Helpers/*.js'],
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length > 0).toBeTruthy();
    expect(handler.templateHandlers[0].outputs[0].content === '').toBeFalsy();
  });

  it('load method should not crash with direct properties', async () => {
    const handler = new BebarHandler(new Bebar({
      data: './test/Assets/Datasets/*.yaml',
      partials: './test/Assets/Partials/*.hbs',
      helpers: './test/Assets/Helpers/*.js',
      templates: [{file: './test/Assets/Templates/list_of_schools.hbs'}],
    }));
    await handler.load();
    expect(handler.templateHandlers[0].outputs.length > 0).toBeTruthy();
    expect(handler.templateHandlers[0].outputs[0].content === '').toBeFalsy();
  });

  it('load method should not crash with direct properties and one file',
      async () => {
        const handler = new BebarHandler(new Bebar({
          data: './test/Assets/Datasets/*.yaml',
          partials: './test/Assets/Partials/school_*.hbs',
          helpers: './test/Assets/Helpers/stringHelpers.js',
          templates: [
            {file: './test/Assets/Templates/list_of_schools_html_list.hbs'}],
        }));
        await handler.load();
        expect(handler.templateHandlers[0].outputs.length > 0).toBeTruthy();
        expect(handler.templateHandlers[0].outputs[0].content === '')
            .toBeFalsy();
        expect(
            handler.templateHandlers[0].outputs[0].content.includes('Harvard'))
            .toBeTruthy();
      });
});
