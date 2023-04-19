import { version } from "./package.json";
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
    resolveId(source, importer) {
      if (source === "./lib/rng") {
        return "../../node_modules/expo-file-system/node_modules/uuid/lib/rng-browser.js";
      }
      if (source === "./rng" && !importer.includes("react-native-uuid")) {
        return "../../node_modules/uuid/dist/rng-browser.js";
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
        file: "dist/commonjs/index.js",
        format: "cjs",
      },
      {
        file: "dist/module/index.es.js",
        format: "esm",
      },
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        __PLATFORM__: "RNCC",
        __VERSION__: version,
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
        file: "dist/commonjs/index.web.js",
        format: "cjs",
        plugins: [
          getBabelOutputPlugin({
            presets: ["@babel/preset-env"],
            plugins: ["react-native-web"],
          }),
        ],
      },
      {
        file: "dist/module/index.es.web.js",
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
        __VERSION__: version,
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
