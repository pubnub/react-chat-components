<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/compatfactory/master/documentation/asset/logo.png" height="70"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A library that unifies the TypeScript Compiler API factory functions across all versions of TypeScript and makes them conform with the Node Factory API

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/compatfactory?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/compatfactory.svg"    /></a>
<a href="https://www.npmjs.com/package/compatfactory"><img alt="NPM version" src="https://badge.fury.io/js/compatfactory.svg"    /></a>
<img alt="Dependencies" src="https://img.shields.io/librariesio/github/wessberg%2Fcompatfactory.svg"    />
<a href="https://github.com/wessberg/compatfactory/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fcompatfactory.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

With the release of TypeScript 4.0, the team announced that [they would move away](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/#usage-of-typescripts-compatfactory-is-deprecated) from the old
set of factory functions for creating and updating nodes, and over to a new Node Factory API.

While this is great, a lot of tooling around TypeScript works across multiple versions of it and either have to stick with the old, deprecated factory functions, stop supporting older versions of TypeScript,
or interchangeably use the old or new factory functions depending on the TypeScript version being used. This is cumbersome, error prone, difficult to read, and hard to maintain.

This library provides a little helper function, `ensureNodeFactory`, which takes a `NodeFactory` or a typescript object, and then returns an object conforming to the `NodeFactory` interface.
In case a `NodeFactory` is passed to it, or if one could be found via the `typescript.factory` property, it will patch any inconsistencies there may be between the signatures of the factory functions across TypeScript versions and most often simply return the existing one with no further edits. For older TypeScript versions, it will
wrap its factory functions with the new API such that you can simply use one API for all your operations.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- A simple wrapper that enables you to use one API for every TypeScript version
- Simple and tiny

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
  - [Peer Dependencies](#peer-dependencies)
- [Usage](#usage)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install compatfactory
```

### Yarn

```
$ yarn add compatfactory
```

### pnpm

```
$ pnpm add compatfactory
```

### Peer Dependencies

`compatfactory` depends on `typescript`, so you need to manually install this as well.

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

Simply import `ensureNodeFactory` and use it in place of the Node Factory you would otherwise be working with.

One very basic example could be:

```ts
import {ensureNodeFactory} from "compatfactory";

// Will use typescript.factory if available, and otherwise return an object that wraps typescript's helper functions
// but makes them conform with the Node Factory API
const factory = ensureNodeFactory(typescript);
factory.createClassDeclaration(/* ... */);
```

A more realistic example would be inside a Custom Transformer context:

```ts
import {ensureNodeFactory} from "compatfactory";
import type TS from "typescript";

function getCustomTransformers(typescript: typeof TS): TS.CustomTransformers {
	return {
		before: [
			context => {
				const factory = ensureNodeFactory(context.factory ?? typescript);

				return sourceFile => {
					return factory.updateSourceFile(
						sourceFile
						// ...
					);
				};
			}
		]
	};
}
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

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->
