import path from 'path';

/**
* Path utility class
*/
export class PathUtils {
  /**
   * Indicates if two path are equivalent or not
   * @param {string} path1 First path to compare
   * @param {string} path2 First path to compare
   * @param {boolean} ignoreCase Indicates if paths are case sentitive or not
   * @return {boolean} True if paths are equal
   */
  public static pathsAreEqual(path1: string, path2: string, ignoreCase: boolean = false): boolean {
    path1 = path.resolve(path1);
    path2 = path.resolve(path2);
    if (process.platform == 'win32' || ignoreCase) {
      return path1.toLowerCase() === path2.toLowerCase();
    }
    return path1 === path2;
  }
}
