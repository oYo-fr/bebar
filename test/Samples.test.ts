import {BebarController} from '../src/BebarController';
import {DiagnosticBag} from '../src/Diagnostics/DiagnosticBag';
import {RefreshContext} from '../src/Refresh/RefreshContext';
import {RefreshType} from '../src/Refresh/RefreshType';

describe('BebarController - error handling', () => {
  it('should report problems', async () => {
    const controller = new BebarController();
    await controller.load('./samples/Basic example/do.bebar');
    expect(DiagnosticBag.Diagnostics.length).toBe(0);
    expect(controller.handlers.length).toBeGreaterThan(0);
    expect(controller.handlers.some((h) => h.datasetHandlers.length === 0)).toBe(false);
    controller.handlers[0].handleRefresh(
        new RefreshContext(
            RefreshType.FileContentChanged,
            controller.handlers[0].ctx,
            './samples/Basic example/factorio_list_of_recepies.hbs',
            './samples/Basic example/factorio_list_of_recepies.hbs',
            'test'));
  });
});
