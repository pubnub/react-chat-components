import { main, module, version } from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";
import ts from "rollup-plugin-ts";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import svg from "rollup-plugin-svg";

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
    resolve({ extensions: [".native.js", ".mjs", ".js", ".json", ".node"] }),
    commonjs(),
    svg(),
    image({ exclude: [/^.*\.(svg)$/] }),
    json(),
    ts(),
    optimizeLodashImports(),
  ],
};
