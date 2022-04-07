import {BebarController} from '../../../src/BebarController';

describe('BebarController - error handling', () => {
  it('load method should report problems', async () => {
    const controller = new BebarController('./test/Assets/Bebar/');
    controller.load('buggy.bebar');
  });
});
