import {BebarController} from '../../src/BebarController';
import {DiagnosticBag} from '../../src/Diagnostics/DiagnosticBag';

describe('BebarController - error handling', () => {
  it('load method should report problems', async () => {
    const controller = new BebarController();
    await controller.load('./test/BuggyAssets/Bebar/buggy.bebar'); // ./test/BuggyAssets/Bebar/buggy.bebar
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
    await controller.load('./test/BuggyAssets/Bebar/buggy.bebar'); // reloading the file should have reset the diagnostics collection bag
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
  });
});
