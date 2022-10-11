const { checkActionsLoaded } = require('./dist/cjs/preset/checkActionsLoaded');

function previewAnnotations(entry = [], options) {
  checkActionsLoaded(options.configDir);
  return entry;
}

module.exports = {
  previewAnnotations,
};
