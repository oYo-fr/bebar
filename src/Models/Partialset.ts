import {Converter} from '../Utils/Converter';
import {Settings} from '../Utils/Settings';
import {IPartialset} from './Interfaces/IPartialset';

import path from 'path';
import glob from 'glob';

/**
 * Represents a place where handlebar partials can be found.
 * A partial set can point to a single file, or a file pattern.
 */
export class Partialset implements IPartialset {
  /** Name that will be used within mustache
   *  templates */
  public name?: string | undefined;

  /** The file that contains the actual data */
  public file?: string | undefined;

  /** The encofing of the file that
   *  contains the data */
  public encoding?: string | undefined;

  /** The url of the file to get */
  public url?: string | undefined;

  /** Http options that can be used to
   *  specify method (GET, POST, ...), headers, ... */
  public httpOptions?: any | undefined;

  /** Actual partial content */
  public content?: string | undefined;
  /**
   * Constructor.
   * @param {IPartialset | undefined} plainObject A plain object containing
   */
  constructor(plainObject: IPartialset | undefined) {
    if (plainObject) Converter.toPartialset(plainObject, this);
    this.setDefaults();
  }

  /**
   * Sets default values where it's needed
   */
  public setDefaults() {
    this.name = (!this.name || this.name === '') &&
        this.file &&
        this.file !== '' &&
        !this.multipleFiles(this.file) ?
        path.parse(this.file).name : this.name;
    this.encoding = (this.file && !this.encoding) ? 'utf-8' : this.encoding;
    if (this.url != null && this.url != undefined &&
        (this.httpOptions === null || this.httpOptions === undefined)) {
      this.httpOptions = {
        method: 'GET',
      };
    }
  }

  /**
   * Tells if the given path contains a wildcard and if the result of this
   * is multiple files
   * @param {sring} p The path to check
   * @return {boolean} True if the path contains a wildcard and gives multiple
   *  files
   */
  private multipleFiles(p: string): boolean {
    return glob.sync(path.resolve(
        Settings.getInstance().workingDirectory, p)).length > 1;
  }
};
