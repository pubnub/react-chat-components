<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/crosspath/master/documentation/asset/logo.png" height="80"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A wrapper around the path module that always normalizes to POSIX (including converting backslashes to forward slashes)

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/crosspath?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/crosspath.svg"    /></a>
<a href="https://www.npmjs.com/package/crosspath"><img alt="NPM version" src="https://badge.fury.io/js/crosspath.svg"    /></a>
<img alt="Dependencies" src="https://img.shields.io/librariesio/github/wessberg%2Fcrosspath.svg"    />
<a href="https://github.com/wessberg/crosspath/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fcrosspath.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

The built-in [`path` module](https://nodejs.org/api/path.html) in Node.js provides utilities for working with file and directory paths in Node.js. The default operation
of it varies [based on the operating system](https://nodejs.org/api/path.html#path_windows_vs_posix) on which Node.js is running.

While this is generally a good thing, there are situations where you might want to normalize paths such that they always follow POSIX formatting.
While the `path` module _does_ export POSIX specific implementations via the [`path.posix`](https://nodejs.org/api/path.html#path_path_posix) property,
it is not really sufficient, as it doesn't convert windows-style paths with backslashes into forward slashes.

`crosspath` is a drop-in replacement for `path` that wraps it to ensure that paths are always POSIX-formatted, including on Windows.
You can still access the underlying implementations via the `native` property, which is useful when you do need to convert back into OS-specific
paths, for example when writing to the file system

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- A drop-in replacement
- Tiny as it relies on the implementations of the underlying path module

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

| <a href="https://usebubbles.com"><img alt="Bubbles" src="https://uploads-ssl.webflow.com/5d682047c28b217055606673/5e5360be16879c1d0dca6514_icon-thin-128x128%402x.png" height="70"   /></a> | <a href="https://github.com/cblanc"><img alt="Christopher Blanchard" src="https://avatars0.githubusercontent.com/u/2160685?s=400&v=4" height="70"   /></a> | <a href="https://github.com/ideal-postcodes"><img alt="Ideal Postcodes" src="https://avatars.githubusercontent.com/u/4996310?s=200&v=4" height="70"   /></a> | <a href="https://www.xerox.com"><img alt="Xerox" src="https://avatars.githubusercontent.com/u/9158512?s=200&v=4" height="70"   /></a> | <a href="https://changelog.me"><img alt="Trent Raymond" src="https://avatars.githubusercontent.com/u/1509616?v=4" height="70"   /></a> | <a href="https://scrubtheweb.com"><img alt="scrubtheweb" src="https://avatars.githubusercontent.com/u/41668218?v=4" height="70"   /></a> |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [Bubbles](https://usebubbles.com)<br><strong>Twitter</strong>: [@usebubbles](https://twitter.com/usebubbles)                                                                                | [Christopher Blanchard](https://github.com/cblanc)                                                                                                         | [Ideal Postcodes](https://github.com/ideal-postcodes)                                                                                                        | [Xerox](https://www.xerox.com)                                                                                                        | [Trent Raymond](https://changelog.me)                                                                                                  | [scrubtheweb](https://scrubtheweb.com)                                                                                                   |

### Patreon

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Patrons on Patreon" src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dwessberg%26type%3Dpatrons"  width="200"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Backers](#backers)
  - [Patreon](#patreon)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [npm](#npm)
  - [Yarn](#yarn)
  - [pnpm](#pnpm)
- [Usage](#usage)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [FAQ](#faq)
  - [Why not simply use `path.posix` always? Isn't this library redundant?](#why-not-simply-use-pathposix-always-isnt-this-library-redundant)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install crosspath
```

### Yarn

```
$ yarn add crosspath
```

### pnpm

```
$ pnpm add crosspath
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

Simply import what you need, exactly as you would with the `path` module:

```ts
// Import just what you need:
import {join, relative} from "crosspath";

// or simply:
import path from "crosspath";

// Becomes 'C:/foo/bar'
path.join("C:\\foo", "\\bar");

// Becomes '../bar'
path.relative("C:\\foo", "C:\\bar");
```

If you want to use the native path helpers and constants without the POSIX normalization, these are all accessible
via the `path.native` property:

```ts
import path from "crosspath";

// Becomes 'C:\foo\bar' on Windows and C:\foo/\bar on POSIX-systems
path.native.join("C:\\foo", "\\bar");

// Becomes '..\bar' on Windows and ../C:\bar on POSIX-systems
path.native.relative("C:\\foo", "C:\\bar");
```

This can be useful when you _do_ want the paths to respect the OS convention, such as when you interact with the file system.

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <a href="mailto:frederikwessberg@hotmail.com"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   /></a>                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br><strong>Twitter</strong>: [@FredWessberg](https://twitter.com/FredWessberg)<br><strong>Github</strong>: [@wessberg](https://github.com/wessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

### Why not simply use `path.posix` always? Isn't this library redundant?

No, not quite (but close). While it is true that `path.posix` can be used from Windows, it has the fundamental
shortcoming that it [doesn't convert backslashes into forward slashes](https://nodejs.org/api/path.html#path_path_normalize_path).
This is not a mistake, but rather a design decision. This library makes another decision and unifies the behavior between
the two approaches to make it easier to build cross-platform libraries and tools.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
