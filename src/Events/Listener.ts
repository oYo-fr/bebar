export interface Listener<T> {
  (event: T): any;
}
