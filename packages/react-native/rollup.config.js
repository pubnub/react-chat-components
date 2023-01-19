// import { main, module, version } from "./package.json";
import packageJson from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";
import ts from "rollup-plugin-ts";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

function loadBrowserCryptoModule() {
  return {
    name: "browser-crypto-module-resolver",
    resolveId(source) {
      if (source === "./lib/rng") {
        return "../../node_modules/uuid/lib/rng-browser.js";
      }
      return null;
    },
    load() {
      return null;
    },
  };
}

function loadNativeModules() {
  return {
    name: "native-module-resolver",
    resolveId(source) {
      if (source === "./android-hack-workaround") {
        return "./src/message-list/android-hack-workaround.native.ts";
      }
      return null;
    },
    load() {
      return null;
    },
  };
}

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson["react-native"],
        format: "cjs",
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        __PLATFORM__: "RNCC",
        __VERSION__: packageJson["version"],
      }),
      peerDepsExternal(),
      loadBrowserCryptoModule(),
      loadNativeModules(),
      commonjs(),
      resolve({
        extensions: [".native.ts", ".native.js", ".mjs", ".ts", ".js", ".json", ".node"],
        browser: true,
      }),
      image(),
      json(),
      ts(),
      optimizeLodashImports(),
    ],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson["main"],
        format: "cjs",
        plugins: [
          getBabelOutputPlugin({
            presets: ["@babel/preset-env"],
            plugins: ["react-native-web"],
          }),
        ],
      },
      {
        file: packageJson["module"],
        format: "esm",
        plugins: [
          getBabelOutputPlugin({
            presets: ["@babel/preset-env"],
            plugins: ["react-native-web"],
          }),
        ],
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        __PLATFORM__: "RNCC",
        __VERSION__: packageJson["version"],
      }),
      peerDepsExternal(),
      loadBrowserCryptoModule(),
      commonjs(),
      resolve({
        browser: true,
        extensions: [
          ".web.tsx",
          ".web.ts",
          ".web.js",
          ".tsx",
          ".ts",
          ".js",
          ".ios.js",
          ".android.js",
        ],
      }),
      image(),
      json(),
      ts(),
      optimizeLodashImports(),
    ],
  },
];
