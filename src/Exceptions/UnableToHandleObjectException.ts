import {BebarException} from './BebarException';

/**
 * Exception that may occurs when no proper handler was found to handle
 * a described object within a bebar file.
 * For example, if the object described by a `data` section in a bebar file
 * contains a property with a `.jpeg` extension, there is a good chance that
 * no handlers will be able to read data from such a file.
 */
export class UnableToHandleObjectException extends BebarException {
};
