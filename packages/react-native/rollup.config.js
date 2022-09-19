import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import ts from "rollup-plugin-ts";

import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      __VERSION__: pkg.version,
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    postcss(),
    image(),
    json(),
    ts(),
    terser(),
  ],
};
