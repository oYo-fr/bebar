# How to load partials

Partials are just parts of templates you can externalize and reuse as you please.

## Options

- ```file [Optional]``` The path to the file containing the partial templates.

Can be ignored if you use the option ```url``` or if you define the `content` directly.

**Cannot** contain wildcards.

- ```encoding [Optional]``` The encoding of the file to read.

Defaults to UTF-8.

- ```content [Optional]``` Direct handlebar handlebar content

Instead of having to create a new file just to put one line of code, you can put your template content right here.

- ```url [Optional]``` The url of the file to load

Files can be loaded from disc and from a remote server.

- ```httpOptions [Optional]``` The http options to use when querying the server (headers, method, ...).

Bebar uses [Axios](https://axios-http.com/) to fetch http requests. You can use all http options you need by follwing [Axio's documentation](https://axios-http.com/docs/req_config).

This can be ignored if the web request is a simple `GET`.

- ```data [Optional]``` The data which is specific only to this template.

There are two levels at which you can define data. At the root of your bebar file, which means that data loaded here will be available for all templates, or at the template level, which means you will only be able to use data loaded here within the specified template.

[Full explanations & examples here](HOWTO_LOAD_DATA.md)

- ```partials [Optional]``` The partials which are specific only to this template.

There are two levels at which you can define partials. At the root of your bebar file, which means that partials loaded here will be available for all templates, or at the template level, which means you will only be able to use partials loaded here within the specified template.

[Full explanations & examples here](HOWTO_LOAD_PARTIALS.md)

- ```helpers [Optional]``` The helpers which are specific only to this template.

There are two levels at which you can define helpers. At the root of your bebar file, which means that helpers loaded here will be available for all templates, or at the template level, which means you will only be able to use helpers loaded here within the specified template.

[Full explanations & examples here](HOWTO_LOAD_HELPERS.md)

- ```output``` That is the path to the file that will be generated.

This can be a mustache template! In this case, you can use your data to name your resulting file.

- ```iterators [Optional]``` Allows to generate multiple files at once from one dataset.

You may have a list of stuff in your initial data somwhere, and you want to generate one file per element in the list. Iterators can help you doing that (see example below for more information).

This is a list, so you can browse nested lists to produce your output files.

- ```iterationValueName [Optional]``` Defines under which name the value extracted with the iterators will be accessible with

By default, if not set, the current value when iterating through lists will be at the root of your data. Setting this options may help you avoid any name clashes.

See example below for more information.

- ```prettify [Optional]``` At the very end of the process, your content can be passed to a prettifier.

Bebar uses [Prettier](https://prettier.io/) to format your files content if needed. All possible options can be found [here](https://prettier.io/docs/en/index.html).

## Examples

``` yaml
templates:
  -
    file: ./Templates/schools.hbs   # will load the content of schools.hbs
    encoding: utf-8                 # using this encoding
    data:                           # merge it with the data from schools.json
      -
        file: ./Datasets/schools.json
    prettify:                       # and will 'prettify' the result
      parser: markdown
    output: ./list_of_schools.md    # to finally produce a file list_of_schools.md
```

``` yaml
templates:
  -
    url: http://localhost/schools.hbs   # will load the content of schools.hbs from the server
    httpOptions:                        # using a 'get' server call
      method: GET
    data:                               # merge it with the data from schools.json
      -
        file: ./Datasets/schools.json
    prettify:                           # and will 'prettify' the result
      parser: markdown
    output: ./list_of_schools.md        # to finally produce a file list_of_schools.md
```

``` yaml
templates:
  -
    content: '{{#each schools}}
{{>school school=.}}

{{/each}}'                              # will  use this content for the template
    data:                               # merge it with the data from schools.json
      -
        file: ./Datasets/schools.json
    prettify:                           # and will 'prettify' the result
      parser: markdown
    output: ./list_of_schools.md        # to finally produce a file list_of_schools.md
```

## Examples to produce multiple output files

Let's consider having the following data:

``` json
[
    {
      name: 'Queen',
      members: [
        {
          name: 'Freddie Mercury',
          wikipedia: 'https://www.wikiwand.com/en/Freddie_Mercury',
        },
        {
          name: 'Brian May',
          wikipedia: 'https://www.wikiwand.com/en/Brian_May',
        },
        {
          name: 'Roger Taylor',
          wikipedia: 'https://www.wikiwand.com/en/Roger_Taylor_(Queen_drummer)',
        },
        {
          name: 'John Deacon',
          wikipedia: 'https://www.wikiwand.com/en/John_Deacon',
        }],
    },
    {
      name: 'The Beatles',
      members: [
        {
          name: 'John Lennon',
          wikipedia: 'https://www.wikiwand.com/en/John_Lennon',
        },
        {
          name: 'Paul McCartney',
          wikipedia: 'https://www.wikiwand.com/en/Paul_McCartney',
        },
        {
          name: 'George Harrison',
          wikipedia: 'https://www.wikiwand.com/en/George_Harrison',
        },
        {
          name: 'Ringo Starr',
          wikipedia: 'https://www.wikiwand.com/en/Ringo_Starr',
        }],
    },
  ]
```

Ths following example will generate one file per band member:

``` yaml
templates:
  -
    content: '{{member.name}} ({{band.name}}) - {{member.wikipedia}}'
    data:
      -
        file: bands.json
        name: bands
    iterators:
      -
        array: bands
        variable: band
      -
        array: members
        variable: member
    output: '{{band.name}}/{{member.name}}.txt'
```

You may also want to define `iterationValueName` so the current occurence within the browsed arrays will be accessible under that variable name (this option exists to avoid any name clash with other datasets you may want to load).

``` yaml
templates:
  -
    content: '{{cur.member.name}} ({{cur.band.name}}) - {{cur.member.wikipedia}}'
    data:
      -
        file: bands.json
        name: bands
    iterators:
      -
        array: bands
        variable: band
      -
        array: members
        variable: member
    iterationValueName: cur
    output: '{{cur.band.name}}/{{cur.member.name}}.txt'
```

> Please note that you can also use this feature with nested arrays. You will simply have to not set the property `array` for the nested array level.

## Content of a template file

For more information about handlebar templates, please refer to [Handlebars's documentation](https://handlebarsjs.com/guide/#partials)
