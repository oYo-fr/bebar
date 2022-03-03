# How to load partials

Partials are just parts of templates you can externalize and reuse as you please.

## Options

- ```name [Optional]``` The name of the partial you will use in your templates.

If you don't specify a name, the value will be the name of the file (without extension).

The name is mandatory when loading the file from a webserver or when using direct content.

This option will be ignored if you use a wildcard in the ```file``` option to load multiple partials at once.

- ```file [Optional]``` The path to the file containing the partial templates.

Can be ignored if you use the option ```url``` or if you define the `content` directly.

Can contain wildcards.

- ```encoding [Optional]``` The encoding of the file to read.

Defaults to UTF-8.

- ```content [Optional]``` Direct handlebar handlebar content

Instead of having to create a new file just to put one line of code, you can put your template content right here.

- ```url [Optional]``` The url of the file to load

Files can be loaded from disc and from a remote server.

- ```httpOptions [Optional]``` The http options to use when querying the server (headers, method, ...).

Bebar uses [Axios](https://axios-http.com/) to fetch http requests. You can use all http options you need by follwing [Axio's documentation](https://axios-http.com/docs/req_config).

This can be ignored if the web request is a simple `GET`.

## Examples

``` yaml
partials:
  -
    file: ./Partials/*.hbs # will load all hbs (handlebars) files in directory Partials
```

> Be carreful with name clashes here, especialy if you load two folders with multiple files having the same names.

``` yaml
partials:
  -
    file: ./Partials/school.hbs # will load all helpers.js file in directory Helpers
```

``` yaml
partials:
  -
    url: http://www.schools.org/schools.hbs # will load the content from the provided url
    httpOptions:
      method: get
      timeout: 1000

```

``` yaml
partials:
  -
    name: school
    content: {{school.id}}. {{school.name}}

```

### Shortcuts

You can also write:

``` yaml
partials:
  - ./folder_1/*.*
  - ./folder_2/*.*
```

Or if you have only one folder/file to load:

``` yaml
partials: ./folder/*.*
```

## Content of a partial file

For more information about handlebar templates, please refer to [Handlebars's documentation](https://handlebarsjs.com/guide/#partials)

## Usage of partials in templates

Example:

``` hbs
{{#each schools}}
  {{>person school=.}}
{{/each}}
```
