import "core-js/modules/es.array.join.js";
import { checkAddonOrder, serverRequire } from '@storybook/core-common';
import path from 'path';
export var checkActionsLoaded = function checkActionsLoaded(configDir) {
  checkAddonOrder({
    before: {
      name: '@storybook/addon-actions',
      inEssentials: true
    },
    after: {
      name: '@storybook/addon-interactions',
      inEssentials: false
    },
    configFile: path.isAbsolute(configDir) ? path.join(configDir, 'main') : path.join(process.cwd(), configDir, 'main'),
    getConfig: function getConfig(configFile) {
      return serverRequire(configFile);
    }
  });
};