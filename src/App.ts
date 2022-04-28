import {BebarController} from './BebarController';

/**
 * Main class for command line call
 */
export class App {
  public bebarController: BebarController;

  /**
   * Constructor
   */
  public constructor() {
    this.bebarController = new BebarController();
  }

  /**
   *Main app method
   * @param {string} filename Name of the bebar file(s) to run (can contain
   *  wildcards)
   */
  public async run(filename: string) {
    await this.bebarController.load(filename);
    await this.bebarController.writeFiles();
  }
}
