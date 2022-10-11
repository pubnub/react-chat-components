<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/helpertypes/master/documentation/asset/logo.png" height="100"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A collection of TypeScript helper types

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/helpertypes?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/helpertypes.svg"    /></a>
<a href="https://www.npmjs.com/package/helpertypes"><img alt="NPM version" src="https://badge.fury.io/js/helpertypes.svg"    /></a>
<a href="https://david-dm.org/wessberg/helpertypes"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fhelpertypes.svg"    /></a>
<a href="https://github.com/wessberg/helpertypes/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fhelpertypes.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This is a simple collection of general purpose helper types for TypeScript that can be used across a wide variety of projects.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- General-purpose
- Small
- Just a few types, nothing else

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

| <a href="https://usebubbles.com"><img alt="Bubbles" src="https://uploads-ssl.webflow.com/5d682047c28b217055606673/5e5360be16879c1d0dca6514_icon-thin-128x128%402x.png" height="70"   /></a> | <a href="https://github.com/cblanc"><img alt="Christopher Blanchard" src="https://avatars0.githubusercontent.com/u/2160685?s=400&v=4" height="70"   /></a> | <a href="https://github.com/ideal-postcodes"><img alt="Ideal Postcodes" src="https://avatars.githubusercontent.com/u/4996310?s=200&v=4" height="70"   /></a> | <a href="https://www.xerox.com"><img alt="Xerox" src="https://avatars.githubusercontent.com/u/9158512?s=200&v=4" height="70"   /></a> |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [Bubbles](https://usebubbles.com)<br><strong>Twitter</strong>: [@usebubbles](https://twitter.com/usebubbles)                                                                                | [Christopher Blanchard](https://github.com/cblanc)                                                                                                         | [Ideal Postcodes](https://github.com/ideal-postcodes)                                                                                                        | [Xerox](https://www.xerox.com)                                                                                                        |

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
  - [Will this library grow over time?](#will-this-library-grow-over-time)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install helpertypes
```

### Yarn

```
$ yarn add helpertypes
```

### pnpm

```
$ pnpm add helpertypes
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

Simply import the types you want from `helpertypes`:

```ts
import {ElementOf} from "helpertypes";

const FAVORITE_FOOD = ["pizza", "burger", "lasagna"] as const;

// "pizza"|"burger"|"lasagna"
type FavoriteFood = ElementOf<typeof FAVORITE_FOOD>;
```

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

### Will this library grow over time?

Yes, but only for helper types that have common applicability. Feel free to submit a PR, and we'll take a look at it then.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
