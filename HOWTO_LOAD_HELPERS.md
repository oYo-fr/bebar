# How to load helpers

Helpers are simple javascript function you will be able to use in jour template files to transform data as needed. It can be functions to upercase a string, format a date, convert values, ...

## Options

- ```file [Optional]``` The path to the file containing the javascript functions.

Can be ignored if you use the option ```url```.

Can contain wildcards.

- ```encoding [Optional]``` The encoding of the file to read.

Defaults to UTF-8.

- ```url [Optional]``` The url of the file to load

Files can be loaded from disc and from a remote server.

- ```httpOptions [Optional]``` The http options to use when querying the server (headers, method, ...).

Bebar uses [Axios](https://axios-http.com/) to fetch http requests. You can use all http options you need by follwing [Axio's documentation](https://axios-http.com/docs/req_config).

This can be ignored if the web request is a simple `GET`.

## Examples

``` yaml
helpers:
  -
    file: ./Helpers/*.js # will load all js files in directory Helpers
```

> Be carreful with name clashes here, especialy if two functions two js files have the same name.

``` yaml
helpers:
  -
    file: ./Helpers/helpers.js # will load all helpers.js file in directory Helpers
```

``` yaml
helpers:
  -
    url: http://www.schools.org/helpers.js # will load the content from the provided url
    httpOptions:
      method: get
      timeout: 1000

```

## Content of a helper file

A helper file is simply a set of javascript functions exported in a module.

``` js
module.exports = {
  bold: function(text) {
    const Handlebars = require('handlebars');
    const result = '**' + Handlebars.escapeExpression(text) + '**';
    return new Handlebars.SafeString(result);
  },
  loud: function (aString) {
    return aString.toUpperCase()
  }
};
```

## Usage of helpers in templates

To use your helpers in templates, please refer to the [handlebar documentation](https://handlebarsjs.com/guide/#custom-helpers).

Example data:

``` json
{
  firstname: "Yehuda",
  lastname: "Katz",
}
```

Example usage:

``` hbs
{{firstname}} {{loud lastname}}
```

Example result:

``` markdown
Yehuda KATZ
```
