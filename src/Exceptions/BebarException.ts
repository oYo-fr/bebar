/**
 * Exception that may occurs when no proper handler was found to handle
 * a described dataset within a bebar file.
 * For example, if the object described by a `data` section in a bebar file
 * contains a property with a `.jpeg` extension, there is a good chance that
 * no handlers will be able to read data from such a file.
 */
export abstract class BebarException {
  /**
   * Constructor
   * @param {any} inner The original exception
   */
  constructor(public sender: any, public inner: any = undefined) {
  }
};
