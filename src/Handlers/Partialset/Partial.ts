/**
 * Represents one partial that will be registered to Handlebars
 */
export class Partial {
  /**
   * Constructor.
   * @param {string} name The name of the partial
   * @param {string} code The code of the partial
   * @param {string} origin The origin of the partial (file or content)
   */
  constructor(public name: string, public code: any, public origin: string) {
  }
}
