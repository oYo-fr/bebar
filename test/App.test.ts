import {App} from '../src/App';

describe('App', () => {
  it('should parse a bebar file correctly', async () => {
    const app = new App();
    await app.run('./test/', 'Assets/Bebar/schools.bebar');
    expect(app.handlers.length).toBe(1);
  });
});
