import {Eventifier} from '../../src/Events/Eventifier';
import {OnChanged} from '../../src/Events/OnChanged';

/**
 * Sample dummy class to test the eventifier
 */
class DummyClass {
  public name: string = 'foo';
  public value: number = 10;

  /**
   * Sample test function to make sure it still works
   * @return {boolean} returns true
   */
  public test(): boolean {
    return true;
  }
}

describe('Eventifier', () => {
  test('Should add events any class', () => {
    const dummy = new DummyClass();
    expect(dummy.name).toBe('foo');
    expect(dummy.value).toBe(10);

    const checkEvent = function(event: OnChanged<any>) {
      expect(event.sender).toBe(dummy);
      expect(event.oldValue).toBe('foo');
      expect(event.newValue).toBe('bar');
      expect(event.property).toBe('name');
      expect(event.sender.name).toBe('bar');
      eventRaised = true;
    };

    let eventRaised = false;
    const listener = Eventifier.on(dummy, checkEvent);
    dummy.name = 'bar';
    expect(eventRaised).toBeTruthy(); // An event should have been raised
    eventRaised = false;
    dummy.name = 'bar';
    expect(eventRaised).toBeFalsy(); // We called the set with the same value
    listener.dispose();
    dummy.name = 'foo';
    expect(eventRaised).toBeFalsy(); // We unregistered the handler...
    Eventifier.once(dummy, checkEvent);
    dummy.name = 'bar';
    expect(eventRaised).toBeTruthy();
    eventRaised = false;
    dummy.name = 'foo';
    expect(eventRaised).toBeFalsy(); // we asked the evt to be raised only once
    expect(dummy.test()).toBeTruthy();
  });

  test('Should not crash on undecorated classes', () => {
    const dummy = new DummyClass();
    Eventifier.off(dummy, () => { });
    try {
      Eventifier.off(dummy, () => { });
      expect(true).toBeTruthy();
    } catch {
      expect(false).toBeTruthy();
    }
  });
});
