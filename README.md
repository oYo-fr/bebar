# Bebar

![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/oYo-fr/d5057d855994a2ab855fe47788858e52/raw/typescript-template__heads_main.json)
[![Node.js CI](https://github.com/oYo-fr/typescript-template/actions/workflows/node.js.yml/badge.svg)](https://github.com/oYo-fr/typescript-template/actions/workflows/node.js.yml)
[![pages-build-deployment](https://github.com/oYo-fr/typescript-template/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/oYo-fr/typescript-template/actions/workflows/pages/pages-build-deployment)

[API documentation](https://oyo-fr/bebar.github.io)

## What is it?

Bebar combines multiple powerfull tools so you can grab data somwhere, and merge it with a template to produce documents.

In a .bebar file, you indicate a few things:

- Where your data is (a path, a webserver). it can be json, yaml, csv, xml, ...
- A template file in a mustache format
- Where to put the result for the merge between you data and your template

And with this you will be able to generate a new readable file thw way you want.

Additionnaly, you _can_ also indicate:

- Where to find partial mustache templates (so you can split and reuse your template parts)
- Where to find helpers which are javascript functions to help you transform your data (to display human-readable dates, currency amounts, various conversions, ...)
- Prettify options so your final output looks beter!

## How to use Bebar

### Install

``` bash
npm install -g bebar
```

### Run

``` bash
bebar
```

### Command line arguments

- `-f, --filename` [optional] The filename of you bebar file(s). The path can include a wildcard. If ommited, will default to *.bebar.
- `-w, --workdir` [optional] The working directory to use when running the bebar files. If you use relative path in your bebar files, they will be combined with this parameter. Defaults to the directory of the parsed bebar file.
- `-v, --verbosity` [optional] Indicates the verbosity level to use. If ommited, will default to INFO. Possible values are INFO, WARN, ERROR and NONE.

## A basic example

### The data (schools.json)

``` json
[
  {
    "id": 1,
    "name": "Harvard University"
  },
  {
    "id": 2,
    "name": "Massachusetts Institute of Technology"
  },
  {
    "id": 3,
    "name": "Stanford University"
  },
]
```

### The template (list_of_schools.mustache)

``` hbs
# List of schools
{{#each schools}}
{{school.id}}. {{school.name}}

{{/each}}
```

### The bebar file (schools.bebar)

``` yaml
data:
  -
    file: ./schools.json
templates:
  -
    file: list_of_schools.mustache
    output: schools.md
```

### The result (schools.md)

``` markdown
# List of schools
1. Harvard University
2. Massachusetts Institute of Technology
3. Stanford University
```

## Installation

``` bash
npm install bebar -g
```

## Usage

### Command
<!-- TODO -->

### Options

## How to create a bebar file

Your bebar file should is in yaml format. It is used to tell bebar where to
find your data, your templates, where to generate files...

### Loading data

You can get your data from anywhere with bebar (a csv, xml, json, yaml, ...).

[Full explanations & examples here](HOWTO_LOAD_DATA.md)

### Setup your template(s)

Your data will be 'merged' with a mustache template to produce an output result.

[Full explanations & examples here](HOWTO_LOAD_TEMPLATES.md)

### Setup helper functions

You can load javascript functions to help you format your data.

[Full explanations & examples here](HOWTO_LOAD_HELPERS.md)

### Setup partial functions

If your template file is too big, or you want to be able to resuse parts of templates, you can split your files using partials and call them from your template.

[Full explanations & examples here](HOWTO_LOAD_PARTIALS.md)

## Credits

### Dependencies

- [handlebar](https://handlebarsjs.com/) to process templates
- [axios](https://axios-http.com/) to fetch http requests.
- [eemeli/yaml](https://eemeli.org/yaml/) to parse yaml contents.
- [mafintosh/csv-parser](https://github.com/mafintosh/csv-parser) to parse csv contents.
- [naturalIntelligence/fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) to parse xml contents.
- [node-eval](https://github.com/node-eval/node-eval) to parse and run javascript files.
- [prettier](https://prettier.io/) to format your resulting files.
- [glob](https://github.com/isaacs/node-glob) to get all the files when using wildcards in paths.
- [commander](https://github.com/tj/commander.js) to parse command line arguments.
- [chalk](https://github.com/chalk/chalk) To colorize the console outputs.
- [clear](https://github.com/bahamas10/node-clear) To clear the console.
- [figlet](https://github.com/patorjk/figlet.js) Just for fun, to have a nicer console.

### Dev dependencies

- [typescript](https://www.typescriptlang.org/)
- [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter/) to mock axios http calls.
- [copyfiles](https://github.com/calvinmetcalf/copyfiles/) to copy some files at build time.
- [eslint](https://github.com/eslint/eslint) for code styling.
- [eslint-config-google](https://github.com/google/eslint-config-google) for code styling.
- [jest](https://jestjs.io/fr/) for testing
- [ts-jest](https://github.com/kulshekhar/ts-jest) to configure jest for typescript.
- [typedoc](https://typedoc.org/) to produce the api documentation.
