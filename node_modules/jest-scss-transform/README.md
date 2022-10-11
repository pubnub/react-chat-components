# jest-scss-transform

![Branches coverage](/cov/badge-branches.svg) ![Functions coverage](/cov/badge-functions.svg) ![Lines coverage](/cov/badge-lines.svg) ![Statements coverage](/cov/badge-statements.svg)

Jest transformer for [.scss files](https://sass-lang.com/).

Useful for when you're [sharing variables between Sass and JavaScript](https://itnext.io/sharing-variables-between-js-and-sass-using-webpack-sass-loader-713f51fa7fa0), and makes your snapshots much nicer.

## Install

`npm i -D jest-scss-transform`

or

`yarn add -D jest-scss-transform`

## Add to your Jest config

Using `jest.config.js`:

```javascript
module.exports = {
  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.scss$": 'jest-scss-transform',
  },
};
```

Similarly, using `"jest"` key in `package.json` (create-react-app, etc):

```json
{
  "jest": {
    "transform": {
      "^.+\\.scss$": "<rootDir>/node_modules/jest-scss-transform"
     }
  }
}
```

## Example

Assume you have an scss file, e.g. `colors.scss`--

```scss
$brandPrimary: #000000;
$brandSecondary: #ffffff;

:export {
  brandPrimary: $brandPrimary;
  brandSecondary: $brandSecondary;
}
```

And you're importing those variables for use in your js app, e.g. `colors.js`--

```javascript
import colors from 'colors.scss';

export const brandPrimary = colors.brandPrimary;
export const brandSecondary = colors.brandSecondary;
```

Webpack will compile these nicely, but Jest will not. Most configurations will result in `undefined` or empty string values for each of those constants.

Using this package, they'll be read-in as the string literal value of the scss variables. For example--

```javascript
import * as colors from 'colors.js';

console.log(colors.brandPrimary); // $brandPrimary
console.log(colors.brandSecondary); // $brandSecondary
```

This makes for really nice snapshot tests, where instead of being written as hex codes (`#04ae46`), `undefined`, etc, style properties are written as their semantic scss variable names (`$brandPrimary`).


See the [example](https://github.com/warrenpay/jest-scss-transform/tree/master/example) directory for a demo of some basic [snapshot output](https://github.com/warrenpay/jest-scss-transform/tree/master/example/__snapshots__).
