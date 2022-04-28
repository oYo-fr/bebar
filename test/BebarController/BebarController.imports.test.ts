import {BebarController} from '../../src/BebarController';
import {DiagnosticBag} from '../../src/Diagnostics/DiagnosticBag';

describe('BebarController - imports', () => {
  it('should load bebar with imports properly', async () => {
    const controller = new BebarController();
    await controller.load('./test/ImportAssets/root.bebar');
    const diagnostics = DiagnosticBag.Diagnostics;
    expect(diagnostics.length).toBe(0);
    const rootHandler = controller.handlers[0];
    expect(rootHandler.importedBebarHandlers[0].datasetHandlers.length).toBeGreaterThan(0);
    expect(rootHandler.importedBebarHandlers[1].helpersetHandlers.length).toBeGreaterThan(0);
    expect(rootHandler.importedBebarHandlers[2].partialsetHandlers.length).toBeGreaterThan(0);
    expect(rootHandler.importedBebarHandlers[3].templateHandlers.length).toBeGreaterThan(0);
    expect(rootHandler.allData.schools).toBeDefined();
  });

  it('should crash when a bebar file references itself', async () => {
    const controller = new BebarController();
    let success = false;
    try {
      await controller.load('./test/ImportAssets/self_loop.bebar');
      success = true;
    } catch (ex) {
      expect((ex as any).importsCallStack.length).toBe(1);
    }
    expect(success).toBeFalsy();
    const diagnostics = DiagnosticBag.Diagnostics;
    expect(diagnostics.length).toBeGreaterThan(0);
  });

  it('should crash when bebar file references each others in a loop', async () => {
    const controller = new BebarController();
    let success = false;
    try {
      await controller.load('./test/ImportAssets/loopA.bebar');
      success = true;
    } catch (ex) {
      expect((ex as any).importsCallStack.length).toBe(2);
    }
    const diagnostics = DiagnosticBag.Diagnostics;
    expect(success).toBeFalsy();
    expect(diagnostics.length).toBeGreaterThan(0);
  });
});
