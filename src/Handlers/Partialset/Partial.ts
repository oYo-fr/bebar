/**
 * Represents one partial that will be registered to Handlebars
 */
export class Partial {
  /**
   * Constructor.
   * @param {string} name The name of the helper
   * @param {string} code The code of the helper
   */
  constructor(public name: string, public code: any) {
  }
}
