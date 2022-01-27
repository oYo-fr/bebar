import {Listener} from './Listener';
import {OnChanged} from './OnChanged';
import {Disposable} from '../Utils/Disposable';

/**
 * Handles for one instance, it's property values and
 * it's listeners
 */
class Decoration {
  public values: any = {};
  public listeners: Listener<any>[] = [];
  public listenersOncer: Listener<any>[] = [];
  /**
   * Constructor
   * @param {any} instance The instance of the object on wich the events
   *  should be raised
   */
  constructor(
    public instance: any) {
    this.values = {
      ...instance,
    };
  }
}

/**
 * Base class that can emit events and handle listeners
 */
export abstract class Eventifier {
  private static decoratedInstances: Array<Decoration> = [];

  /**
   * Registers a listener
   * @param {any} obj The object on which the listener should be registered
   * @param {Listener<T>} listener The listener to register
   * @return {Disposable} An object to call dispose to
   */
  static on = (obj: any, listener: Listener<OnChanged<any>>): Disposable => {
    const decorated = Eventifier.decorateInstance(obj);
    decorated.listeners.push(listener);
    return {
      dispose: () => Eventifier.off(obj, listener),
    };
  };

  /**
   * Registers a listener that will be called only once
   * @param {any} obj The object on which the listener should be registered
   * @param {Listener<T>} listener The listener to register
   */
  static once = (obj: any, listener: Listener<any>): void => {
    const decorated = Eventifier.decorateInstance(obj);
    decorated.listenersOncer.push(listener);
  };

  /**
   * Unregisters a listener
   * @param {any} obj The object on which the listener should be unregistered
   * @param {Listener<any>} listener The listener to unregister
   */
  static off = (obj: any, listener: Listener<any>) => {
    const decorated = Eventifier.findDecoratedObject(obj);
    if (!decorated) return;
    const callbackIndex = decorated.listeners.indexOf(listener);
    if (callbackIndex > -1) decorated.listeners.splice(callbackIndex, 1);
  };

  /**
   * Emits an event
   * @param {any} event The event to emit
   */
  private static emit = (event: any) => {
    /** Update any general listeners */
    const decorated =
      Eventifier.findDecoratedObject(event.sender) as Decoration;
    decorated.listeners.forEach((listener) => listener(event));

    /** Clear the `once` queue */
    if (decorated.listenersOncer.length > 0) {
      const toCall = decorated.listenersOncer;
      decorated.listenersOncer = [];
      toCall.forEach((listener) => listener(event));
    }
  };

  /**
   * Decorates an object instance to raise events
   * @param {any} obj The object to decorate
   * @return {Decoration} An object that describes the decorated object, it's
   *  listeners, and it's current value
   */
  private static decorateInstance(obj: any): Decoration {
    let decorated = Eventifier.findDecoratedObject(obj);
    if (!decorated) {
      decorated = new Decoration(obj);
      Eventifier.decoratedInstances.push(decorated);
      Object.keys(obj).forEach((property) => {
        Eventifier.eventifyProperty(obj, property);
      });
    }
    return decorated;
  }

  /**
   * Overrides the set and get accessors on a specific property
   * for the provided object instance
   * @param {any} obj The object to spy on
   * @param {string} property The property to spy
   */
  private static eventifyProperty(obj: any, property: string) {
    delete obj[property];
    Object.defineProperty(obj, property, {
      get: function() {
        const decorated = Eventifier.findDecoratedObject(obj) as Decoration;
        return decorated.values[property];
      },
      set: function(value) {
        const decorated = Eventifier.findDecoratedObject(obj) as Decoration;
        const oldValue = decorated.values[property];
        if (decorated.values[property] !== value) {
          decorated.values[property] = value;
          Eventifier.emit(new OnChanged(obj, property, oldValue, value));
        }
      },
    });
  }

  /**
   * Finds a possible decoration for an instance of an object
   * @param {any} obj The object for which we need the decoration
   * @return {Decoration | undefined} The decoration if any
   */
  private static findDecoratedObject(obj: any): Decoration | undefined {
    return Eventifier.decoratedInstances.find((d) => d.instance == obj);
  }
}
