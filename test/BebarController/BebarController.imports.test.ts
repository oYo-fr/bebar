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
});
