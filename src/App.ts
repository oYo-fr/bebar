import {BebarController} from './BebarController';

/**
 * Main class for command line call
 */
export class App {
  public bebarController: BebarController = new BebarController();
  /**
   *Main app method
   * @param {string} workdir Working directory
   * @param {string} filename Name of the bebar file(s) to run (can contain
   *  wildcards)
   */
  public async run(workdir: string, filename: string) {
    await this.bebarController.load(workdir, filename);
    await this.bebarController.writeFiles();
  }
}
