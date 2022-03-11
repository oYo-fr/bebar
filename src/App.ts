import {BebarController} from './BebarController';

/**
 * Main class for command line call
 */
export class App {
  public bebarController: BebarController;

  /**
   * Constructor
   * @param {string} workdir Working directory
   */
  public constructor(public workdir: string) {
    this.bebarController = new BebarController(workdir);
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
