
import {Dataset} from '../Models/Dataset';
const md5 = require('md5');
import fs from 'fs';
import path from 'path';
import util from 'util';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const timespan = require('timespan-parser');

type CacheGetMethod = (options?: any)
  => Promise<any>;

/** Utility class to enable datasets to be locally cached. Very useful when having data comming from http */
export abstract class DatasetCache {
  public static Directory: string = './.cache/';

  /**
   * Gets data from a file cache or from the given callback according to dataset settings
   * @param {Dataset} dataset The dataset to get cache from
   * @param {CacheGetMethod} callback Method to call when cache is undefined or when ttl has expired
   * @param {any} callbackOptions The options to pass to the callback method
   * @return {any} The dataset object
   */
  static async get(dataset: Dataset, callback: CacheGetMethod, callbackOptions: any): Promise<any> {
    if (!dataset.cache || !dataset.cache.enabled) return await callback(callbackOptions);
    const key = md5(JSON.stringify({
      url: dataset.url,
      file: dataset.file,
      httpOptions: dataset.httpOptions,
    }));
    const cacheDirectory = path.resolve(path.join(callbackOptions.ctx.rootPath, DatasetCache.Directory));
    const cacheFilePath = path.resolve(path.join(cacheDirectory, key));
    if (fs.existsSync(cacheFilePath)) {
      if (!dataset.cache.ttl) {
        return JSON.parse(await readFile(cacheFilePath, 'utf-8'));
      } else {
        const stats = fs.statSync(cacheFilePath);
        const ttlInSecs = timespan.parse(dataset.cache.ttl);
        stats.ctime.setSeconds(stats.ctime.getSeconds() + ttlInSecs);
        if (stats.ctime.getTime() > Date.now()) {
          return JSON.parse(await readFile(cacheFilePath, 'utf-8'));
        } else {
          fs.rmSync(cacheFilePath);
        }
      }
    }
    const result = await callback(callbackOptions);
    fs.mkdirSync(cacheDirectory, {recursive: true});
    await writeFile(cacheFilePath, JSON.stringify(result), 'utf-8');
    return result;
  }
}
