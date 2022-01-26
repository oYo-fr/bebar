/**
 * Dummy sample class
 */
export class Main {
  /**
   * Hello world method
   * @param {string} who Who to say hello to.
   * @return {string} Hello world by default.
   */
  public hello(who: string = 'world'): string {
    return `Hello ${who}!`;
  }
}

const m: Main = new Main();
console.log(m.hello());
console.log('done!');
