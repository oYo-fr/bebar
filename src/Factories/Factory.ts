import {UnableToHandleObjectException}
  from '../Exceptions/UnableToHandleObjectException';
import {Eventifier} from '../Events/Eventifier';

/**
 * Base factory that contains basic objects creation methods
 */
export abstract class Factory<T, TH> {
  public handler: TH | undefined;

  /**
   * Constructor
   * @param {Array} HandlerTypes The types of possible handlers the factory
   * @param {T} Model The object the factory is responsible for
   * should tests the loadable object from
   */
  constructor(
    public handlerTypes: Array<any> = [],
    public model: T) {
  }

  /**
   * Creates a instance of a DatasetHandler
   * @param {new} Type The handler type to create
   * @return {TH} A handler
   */
  private create(Type: new (T: any) => TH): TH {
    return new Type(this.model);
  }

  /**
   * Picks a handler for the specified object
   * @param {string} rootPath The folder where the bebar file is
   * @return {TH | undefined} A handler for the object
   */
  public pickHandlerType(rootPath: string) : TH | undefined {
    const handlerType = this.handlerTypes.find(
        (t) => t.canHandle(this.model, rootPath));
    return handlerType ? this.create(handlerType) : undefined;
  }

  /**
   * Loads a proper handler if possible
   * @param {string} rootPath The folder where the bebar file is
   */
  public load(rootPath: string) {
    this.handler = this.pickHandlerType(rootPath);
    if (this.handler !== undefined) {
      Eventifier.once(this.model, () => this.load(rootPath));
    } else {
      throw new UnableToHandleObjectException(this);
    }
  }
}
