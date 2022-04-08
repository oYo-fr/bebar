import {HelpersetHandler}
  from '../../../src/Handlers/Helperset/HelpersetHandler';
import {Helperset} from '../../../src/Models/Helperset';
import {DiagnosticBag} from '../../../src/Diagnostics/DiagnosticBag';
import Handlebars from 'handlebars';

describe('HelpersetHandler - error handling', () => {
  it('load method should report problems', async () => {
    const handler = new HelpersetHandler(new Helperset({
      file: './test/BuggyAssets/Helpers/buggy.js',
    }), Handlebars.create());
    await handler.load('.');
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
  });
});
