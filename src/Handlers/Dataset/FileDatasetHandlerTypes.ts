import {JSonFileDatasetHandler}
  from './JSonFileDatasetHandler';
import {YamlFileDatasetHandler}
  from './YamlFileDatasetHandler';
import {CSVFileDatasetHandler}
  from './CSVFileDatasetHandler';
import {JSFileDatasetHandler}
  from './JSFileDatasetHandler';
import {RegexFileDatasetHandler}
  from './RegexFileDatasetHandler';
import {XmlFileDatasetHandler}
  from './XmlFileDatasetHandler';
import {RawFileDatasetHandler}
  from './RawFileDatasetHandler';

export const FileDatasetHandlerTypes = [
  RawFileDatasetHandler,
  JSonFileDatasetHandler,
  YamlFileDatasetHandler,
  CSVFileDatasetHandler,
  XmlFileDatasetHandler,
  JSFileDatasetHandler,
  RegexFileDatasetHandler,
];
