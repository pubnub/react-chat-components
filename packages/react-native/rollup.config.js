import { main, module, version } from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";
import ts from "rollup-plugin-ts";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: main,
      format: "cjs",
    },
    {
      file: module,
      format: "esm",
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      __PLATFORM__: "RNCC",
      __VERSION__: version,
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    postcss(),
    image(),
    json(),
    ts(),
  ],
};
