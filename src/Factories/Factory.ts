import {UnableToHandleObjectException}
  from '../Exceptions/UnableToHandleObjectException';
import {Eventifier} from '../Events/Eventifier';
import {BebarHandlerContext} from '../Handlers/Bebar/BebarHandlerContext';

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
   * @param {BebarHandlerContext} ctx The bebar execution context
   * @return {TH | undefined} A handler for the object
   */
  public pickHandlerType(ctx: BebarHandlerContext) : TH | undefined {
    const handlerType = this.handlerTypes.find(
        (t) => t.canHandle(this.model, ctx));
    return handlerType ? this.create(handlerType) : undefined;
  }

  /**
   * Loads a proper handler if possible
   * @param {BebarHandlerContext} ctx The bebar execution context
   */
  public load(ctx: BebarHandlerContext) {
    this.handler = this.pickHandlerType(ctx);
    if (this.handler) {
      const instance = this;
      Eventifier.once(this.model, () => instance.load(ctx));
    } else {
      throw new UnableToHandleObjectException(this);
    }
  }
}
