
import {Dataset} from '../Models/Dataset';
var md5 = require('md5');
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
   * @returns The dataset object
   */
  static async get(dataset: Dataset, callback: CacheGetMethod, callbackOptions: any): Promise<any> {
    if (!dataset.cache || !dataset.cache.enabled) return await callback(callbackOptions);
    const key = md5(JSON.stringify({
      url: dataset.url,
      file: dataset.file,
      httpOptions: dataset.httpOptions
    }));
    const cacheFilePath = path.join(DatasetCache.Directory, key)
    if(fs.existsSync(cacheFilePath)) {
      if(!dataset.cache.ttl) {
        return JSON.parse(await readFile(cacheFilePath, 'utf-8'));
      } else {
        const stats = fs.statSync(cacheFilePath);
        const ttlInSecs = timespan.parse(dataset.cache.ttl);
        stats.ctime.setSeconds(stats.ctime.getSeconds() + ttlInSecs);
        if(stats.ctime.getTime() > Date.now()) {
          return JSON.parse(await readFile(cacheFilePath, 'utf-8'));
        } else {
          fs.rmSync(cacheFilePath);
        }
      }
    }
    const result = await callback(callbackOptions);
    await writeFile(cacheFilePath, result);
    return result;
  }
}
