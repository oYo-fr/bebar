import {App} from '../src/App';

describe('App', () => {
  it('should parse a bebar file correctly', async () => {
    const app = new App();
    await app.run('./test/', 'Assets/Bebar/schools.bebar');
    expect(app.bebarController.handlers.length).toBe(1);
  });

  it('should parse another bebar file correctly', async () => {
    const app = new App();
    await app.run('./test/', 'Assets/Bebar/vscode-colors-to-css-vars.bebar');
    expect(app.bebarController.handlers.length).toBe(1);
  });
});
