import {ICachingOptions} from './Interfaces/ICachingOptions';

/**
 * Class that represents caching options to be used with datasets
 */
export class CachingOptions {
  /** The maximum amount of time a cached data should live */
  public ttl?: string | undefined;

  /** If the cache is enabled or not */
  public enabled: boolean = false;

  /**
   * Constructor.
   * @param {IBebar | undefined} plainObject A plain object containing
   *  required properties
   */
  constructor(plainObject: ICachingOptions | undefined) {
    if (plainObject) {
      this.ttl = plainObject.ttl;
      this.enabled = plainObject.enabled;
    }
  }
};
