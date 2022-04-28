import {BebarException} from './BebarException';

/**
 * Exception that may occurs when no proper handler was found to handle
 * a described dataset within a bebar file.
 * For example, if the object described by a `data` section in a bebar file
 * contains a property with a `.jpeg` extension, there is a good chance that
 * no handlers will be able to read data from such a file.
 */
export class BebarLoopLoadingException extends BebarException {
  /**
   * Constructor
   * @param {any} sender The sender of the exception
   * @param {any} inner The original exception
   * @param {string[]} importsCallStack The list of loaded bebars when a loop is detected
   */
  constructor(public sender: any, public inner: any = undefined, public importsCallStack: string[] = []) {
    super(sender, inner);
  }
};
