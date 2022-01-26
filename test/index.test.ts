import {Main} from '../src/index';

describe('Sample dummy test', () => {
  let service: Main;

  beforeEach(() => service = new Main());

  test('Calls the hello method to check the default output', () => {
    expect(service.hello()).toBe('Hello world!');
  });
});
