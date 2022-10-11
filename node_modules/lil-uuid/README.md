# [lil](http://lil-js.github.io)'-uuid [![Build Status](https://api.travis-ci.org/lil-js/uuid.svg?branch=master)][travis] [![Stories in Ready](https://badge.waffle.io/lil-js/uuid.png?label=ready&title=Ready)](https://waffle.io/lil-js/uuid) [![Code Climate](https://codeclimate.com/github/lil-js/uuid/badges/gpa.svg)](https://codeclimate.com/github/lil-js/uuid) [![Gitter chat](https://badges.gitter.im/lil-js/all.png)](https://gitter.im/lil-js/all)

<img align="center" height="150" src="http://lil-js.github.io/img/liljs-logo.png" />

UUID v4 generator and validator (RFC4122 compliant)

<table>
<tr>
<td><b>Name</b></td><td>uuid</td>
</tr>
<tr>
<td><b>Version</b></td><td>0.1.0</td>
</tr>
<tr>
<td><b>Size</b></td><td>1 KB / >1 KB (gzipped)</td>
</tr>
<tr>
<td><b>Environment</b></td><td>Browser, Node.js</td>
</tr>
</table>

## Installation

Via [Bower](http://bower.io)
```bash
bower install lil-uuid
```
Via [Component](https://github.com/componentjs/component)
```bash
component install lil-js/uuid
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/lil-js/uuid/0.1.0/uuid.js"></script>
```

### Environments

- Node.js
- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 9

### Usage

You could fetch de module via `require()` if it's available.
Otherwise, global fallback will be used, exposed via `lil.uuid`

##### Generate an UUID v4 schema
```js
lil.uuid()
// -> f47ac10b-58cc-4372-a567-0e02b2c3d479
```

##### Validate an UUID schema (it support multiple versions)
```js
lil.isUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')
// -> true
```

## API

#### uuid()
Return: `string`

Generate a random UUID

#### isUUID(str, [version])
Return: `boolean`

Check if a given `string` has a valid UUID format.
It supports multiple version (3, 4 and 5)

#### uuid.VERSION

## Contributing

Wanna help? Cool! It will be appreciated :)

You must add new test cases for any new feature or refactor you do,
always following the same design/code patterns that already exist

### Development

Only [node.js](http://nodejs.org) is required for development

Clone the repository
```bash
$ git clone https://github.com/lil-js/uuid.git && cd uuid
```

Install dependencies
```bash
$ npm install
```

Generate browser bundle source
```bash
$ make browser
```

Run tests
```bash
$ make test
```

## License

[MIT](http://opensource.org/licenses/MIT) © Tomas Aparicio

[travis]: http://travis-ci.org/lil-js/uuid
