import { main, module, version } from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import replace from "@rollup/plugin-replace";
import ts from "rollup-plugin-ts";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

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
      __PLATFORM__: "RCC",
      __VERSION__: version,
    }),
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    commonjs(),
    postcss(),
    svgr(),
    json(),
    ts(),
    optimizeLodashImports(),
  ],
};
