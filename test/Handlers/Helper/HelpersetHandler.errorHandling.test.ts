import {HelpersetHandler}
  from '../../../src/Handlers/Helper/HelpersetHandler';
import {Helperset} from '../../../src/Models/Helperset';
import {DiagnosticBag} from '../../../src/Diagnostics/DiagnosticBag';
import Handlebars from 'handlebars';

describe('HelpersetHandler - error handling', () => {
  it('load method should report problems', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/Assets/Helpers/buggy.js',
    }), Handlebars.create());
    await handler.load('.');
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
  });
});
