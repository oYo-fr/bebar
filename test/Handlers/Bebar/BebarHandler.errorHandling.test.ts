import {BebarHandler} from '../../../src/Handlers/Bebar/BebarHandler';
import {Bebar} from '../../../src/Models/Bebar';
import {DiagnosticBag} from '../../../src/Diagnostics/DiagnosticBag';

describe('BebarHandler - error handling', () => {
  it('load method should report problems', async () => {
    let handler = new BebarHandler(new Bebar({
      partials: [{file: './test/BuggyAssets/Partials/buggy.hbs'}],
      templates: [{file: './test/BuggyAssets/Templates/call_buggy_partial.hbs'}],
    }), '.', 'sample.bebar');
    try {
      await handler.load();
    } catch {}
    expect(DiagnosticBag.Diagnostics.length).toBe(1);

    handler = new BebarHandler(new Bebar({
      data: [{file: './test/BuggyAssets/Datasets/buggy.json'}],
      partials: [{file: './test/BuggyAssets/Partials/buggy.hbs'}],
      templates: [{file: './test/BuggyAssets/Templates/call_buggy_partial.hbs'}],
    }), '.', 'sample.bebar');
    try {
      await handler.load();
    } catch {}
    expect(DiagnosticBag.Diagnostics.length).toBe(2);
  });
});
