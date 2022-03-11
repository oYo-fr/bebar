import {App} from '../src/App';

describe('App', () => {
  it('should parse a bebar file correctly', async () => {
    const app = new App('./test/');
    await app.run('Assets/Bebar/schools.bebar');
    expect(app.bebarController.handlers.length).toBe(1);
  });

  it('should parse another bebar file correctly', async () => {
    const app = new App('./test/');
    await app.run('Assets/Bebar/vscode-colors-to-css-vars.bebar');
    expect(app.bebarController.handlers.length).toBe(1);
  });
});
