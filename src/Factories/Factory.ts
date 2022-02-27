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
   * @param {T} o The object to find a handler for
   * @return {TH | undefined} A handler for the object
   */
  public pickHandlerType() : TH | undefined {
    const handlerType = this.handlerTypes.find((t) => t.canHandle(this.model));
    return handlerType ? this.create(handlerType) : undefined;
  }

  /**
   * Loads a proper handler if possible
   */
  public load() {
    this.handler = this.pickHandlerType();
    if (this.handler !== undefined) {
      Eventifier.once(this.model, () => this.load());
    } else {
      throw new UnableToHandleObjectException(this);
    }
  }
}
