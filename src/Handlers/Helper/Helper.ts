/**
 * Represents one helper function that will be registered to Handlebars
 */
export class Helper {
  /**
   * Constructor.
   * @param {string} name The name of the helper
   * @param {any} func The function of the helper
   * @param {string} origin The origin of the helper (file or content)
   */
  constructor(public name: string, public func: any, public origin: string) {
  }
}
