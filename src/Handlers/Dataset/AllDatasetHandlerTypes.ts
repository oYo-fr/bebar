
import {DirectDatasetHandler}
  from './DirectDatasetHandler';
import {MultipleFilesFileDatasetHandler}
  from './MultipleFilesFileDatasetHandler';
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

export const AllDatasetHandlerTypes = [
  DirectDatasetHandler,
  RawFileDatasetHandler,
  MultipleFilesFileDatasetHandler,
  JSonFileDatasetHandler,
  YamlFileDatasetHandler,
  CSVFileDatasetHandler,
  XmlFileDatasetHandler,
  JSFileDatasetHandler,
  RegexFileDatasetHandler,
];
