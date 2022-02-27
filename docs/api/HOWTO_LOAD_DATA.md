# How to load data

## For all files

### Common options

- ```name [Optional]``` The name of the variable that will contain the data within the file.

If you don't specify a name, the value will be the name of the file (without extension).

The name is mandatory when loading the file from a webserver, or if the extension of your file does not match it's content.

This option will be ignored if you use a wildcard in the ```file``` option to load multiple files at once.

- ```file [Optional]``` The path to the file containing the data.

Can be ignored if you use the option ```url```.

Can contain wildcards.

- ```encoding [Optional]``` The encoding of the file to read.

Defaults to UTF-8.

- ```parseAs [Optional]``` Forces to parse a file in a certain way.

If ignored, the way the file is interpreted depends on it's the extension. ```schools.json``` will be read as a json, ```schools.csv``` will be read as csv, ...

Possible values are ```json```, ```yaml```, ```yml```, ```csv```, ```xml```, ```json```, ```js```, ```javascript``` and ```regex```.

This option is mandatory when loading a file from http.

- ```url [Optional]``` The url of the file to load

Files can be loaded from disc and from a remote server.
Please specify the ```parseAs``` option if loading from http(s).

- ```httpOptions [Optional]``` The http options to use when querying the server (headers, method, ...).

Bebar uses [Axios](https://axios-http.com/) to fetch http requests. You can use all http options you need by follwing [Axio's documentation](https://axios-http.com/docs/req_config).

This can be ignored if the web request is a simple `GET`.

## Examples

``` yaml
data:
  -
    file: schools.json # will load the file schools.json. You will use the name "schools" in your templates to access the data
```

``` yaml
data:
  -
    name: top_schools
    file: schools.json # will load the file schools.json. You will use the name "top_schools" in your templates to access the data
```

``` yaml
data:
  -
    encoding: utf16le
    file: schools.json # will load the file schools.json using the utf16le encoding. You will use the name "schools" in your templates to access the data
```

``` yaml
data:
  - file: ./folder/*.* # will load all the files in folder. You will use the name of the file (without extension) in your templates to access the data
```

> Be carreful with name clashes here, which could occur if you have for examples the files ```schools.json``` and ```schools.csv``` in the folder.

``` yaml
data:
  -
    url: http://www.schools.org/schools.json/2022 # will load the content from the provided url
    parseAs: json # indicates to parse the content as json data
    httpOptions:
      method: get
      timeout: 1000

```

## JSon files

```parseAs``` option value: ```json```

Bebar uses the standard javascript json parser, no options are available.

Example:

``` yaml
data:
  -
    name: top_schools
    file: schools.json # will load the file schools.json. You will use the name "top_schools" in your templates to access the data
    parseAs: json
```

## Yaml files

```parseAs``` option values: ```yaml```, ```yml```

Bebar uses [eemeli/yaml](https://eemeli.org/yaml/).

You can additionnaly pass options to the parser by followin eemeli's documentation.

Example:

``` yaml
data:
  -
    name: top_schools
    file: schools.yaml # will load the file schools.yaml. You will use the name "top_schools" in your templates to access the data
    parseAs: yaml
    options:
      intAsBigInt: true # Please refer to https://eemeli.org/yaml/ for more options
```

## Csv files

```parseAs``` option value: ```csv```

Bebar uses [mafintosh/csv-parser](https://github.com/mafintosh/csv-parser).

You can additionnaly pass options to the parser by followin [mafintosh's documentation](https://github.com/mafintosh/csv-parser#api).

Example:

``` yaml
data:
  -
    name: top_schools
    file: schools.csv # will load the file schools.yaml. You will use the name "top_schools" in your templates to access the data
    parseAs: csv
    options:
      separator: , # Please refer to https://eemeli.org/yaml/ for more options
```

## Xml files

```parseAs``` option value: ```xml```

Bebar uses [NaturalIntelligence/fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser).

You can additionnaly pass options to the parser by followin [NaturalIntelligence's documentation](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md).

Example:

``` yaml
data:
  -
    name: top_schools
    file: schools.xml # will load the file schools.yaml. You will use the name "top_schools" in your templates to access the data
    parseAs: xml
    options:
      allowBooleanAttributes: true # Please refer to https://eemeli.org/yaml/ for more options
```

## Javascript files

```parseAs``` option values: ```js```, ```javascript```

Bebar uses [node-eval](https://github.com/node-eval/node-eval).

Your js file needs to contain a javascript function. This function can accept a `context` object whilch will contain the current working directory(`context.workingDir`), and the current data object within the bebar file (`context.data`).

With this, you can extend bebar to be able to query any system you like (database engines, other file types, ...).

Examples of valid js files:

``` js
module.exports = [
  { name: 'Nils', age: 24 },
  { name: 'Teddy', age: 14 },
  { name: 'Nelson', age: 45 },
];
```

``` js
module.exports = async (context) => {
  const fs = require('fs');
  // Do whatever you like here...
  return context.options;
};
```

Example:

``` yaml
data:
  -
    name: top_schools
    file: schools.js # will parse and run the javascript file to get the data.
    parseAs: js
    options:
      foo: bar # Anything you want!
```

## Direct content

For simple data or for any settings you would like to pass to your templates, you can use direct content within bebar files.

Example:

``` yaml
data:
  -
    name: dummy
    content:
      foo: bar # Or anything you want
```

## Regex on content

```parseAs``` option value: ```regex```

It is possible to read any file and extract data from it using regular expressions.

> Use named groups to use your data more easily within you template files.

Example with a parsed file:

- schools.html:

``` html
<head>
  <body>
    <ul>
      <li>1. Harvard University</li>
      <li>2. Massachusetts Institute of Technology</li>
      <li>3. Stanford University</li>
      <li>4. University of California, Berkeley</li>
      <li>5. University of Oxford</li>
      <li>6. Columbia University</li>
      <li>7. University of Washington, Seattle</li>
      <li>8. University of Cambridge</li>
      <li>9. California Institute of Technology</li>
      <li>10. Johns Hopkins University</li>
    </ul>
  </body>
</head>
```

- Bebar file

``` yaml
data:
  -
    name: schools.html
    parseAs: regex
    options:
      regex: !ruby/regexp '/<li>(?<id>\d*).\s(?<name>[^\<]*)<\/li>/gm'
```
