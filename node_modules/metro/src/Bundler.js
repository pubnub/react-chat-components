/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

const Transformer = require("./DeltaBundler/Transformer");

const DependencyGraph = require("./node-haste/DependencyGraph");

class Bundler {
  constructor(config, options) {
    this._depGraphPromise = DependencyGraph.load(config, options);
    this._readyPromise = this._depGraphPromise
      .then((dependencyGraph) => {
        config.reporter.update({
          type: "transformer_load_started",
        });
        this._transformer = new Transformer(
          config, // $FlowFixMe[method-unbinding] added when improving typing for this parameters
          dependencyGraph.getSha1.bind(dependencyGraph)
        );
        config.reporter.update({
          type: "transformer_load_done",
        });
      })
      .catch((error) => {
        console.error("Failed to construct transformer: ", error);
        config.reporter.update({
          type: "transformer_load_failed",
          error,
        });
      });
  }

  async end() {
    const dependencyGraph = await this._depGraphPromise;

    this._transformer.end();

    dependencyGraph.end();
  }

  async getDependencyGraph() {
    return await this._depGraphPromise;
  }

  async transformFile(filePath, transformOptions) {
    // We need to be sure that the DependencyGraph has been initialized.
    // TODO: Remove this ugly hack!
    await this._depGraphPromise;
    return this._transformer.transformFile(filePath, transformOptions);
  } // Waits for the bundler to become ready.

  async ready() {
    await this._readyPromise;
  }
}

module.exports = Bundler;
