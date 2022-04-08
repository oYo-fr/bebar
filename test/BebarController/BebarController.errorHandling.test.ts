import {BebarController} from '../../src/BebarController';
import {DiagnosticBag} from '../../src/Diagnostics/DiagnosticBag';

describe('BebarController - error handling', () => {
  it('load method should report problems', async () => {
    const controller = new BebarController('./test/BuggyAssets/Bebar/');
    await controller.load('buggy.bebar');
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
    await controller.load('buggy.bebar'); // reloading the file should have reset the collectio bag
    expect(DiagnosticBag.Diagnostics.length).toBe(1);
  });
});
