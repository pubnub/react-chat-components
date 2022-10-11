"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePlaceholderInTemplate = changePlaceholderInTemplate;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _walk = _interopRequireDefault(require("../../tools/walk"));

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// We need `graceful-fs` behavior around async file renames on Win32.
// `gracefulify` does not support patching `fs.promises`. Use `fs-extra`, which
// exposes its own promise-based interface over `graceful-fs`.

/**
  TODO: This is a default placeholder for title in react-native template.
  We should get rid of this once custom templates adapt `placeholderTitle` in their configurations.
*/
const DEFAULT_TITLE_PLACEHOLDER = 'Hello App Display Name';

async function replaceNameInUTF8File(filePath, projectName, templateName) {
  _cliTools().logger.debug(`Replacing in ${filePath}`);

  const fileContent = await _fsExtra().default.readFile(filePath, 'utf8');
  const replacedFileContent = fileContent.replace(new RegExp(templateName, 'g'), projectName).replace(new RegExp(templateName.toLowerCase(), 'g'), projectName.toLowerCase());

  if (fileContent !== replacedFileContent) {
    await _fsExtra().default.writeFile(filePath, replacedFileContent, 'utf8');
  }
}

async function renameFile(filePath, oldName, newName) {
  const newFileName = _path().default.join(_path().default.dirname(filePath), _path().default.basename(filePath).replace(new RegExp(oldName, 'g'), newName));

  _cliTools().logger.debug(`Renaming ${filePath} -> file:${newFileName}`);

  await _fsExtra().default.rename(filePath, newFileName);
}

function shouldRenameFile(filePath, nameToReplace) {
  return _path().default.basename(filePath).includes(nameToReplace);
}

function shouldIgnoreFile(filePath) {
  return filePath.match(/node_modules|yarn.lock|package-lock.json/g);
}

const UNDERSCORED_DOTFILES = ['buckconfig', 'eslintrc.js', 'flowconfig', 'gitattributes', 'gitignore', 'prettierrc.js', 'watchmanconfig', 'editorconfig', 'bundle', 'ruby-version', 'xcode.env'];

async function processDotfiles(filePath) {
  const dotfile = UNDERSCORED_DOTFILES.find(e => filePath.includes(`_${e}`));

  if (dotfile === undefined) {
    return;
  }

  await renameFile(filePath, `_${dotfile}`, `.${dotfile}`);
}

async function changePlaceholderInTemplate({
  projectName,
  placeholderName,
  placeholderTitle = DEFAULT_TITLE_PLACEHOLDER,
  projectTitle = projectName
}) {
  _cliTools().logger.debug(`Changing ${placeholderName} for ${projectName} in template`);

  for (const filePath of (0, _walk.default)(process.cwd()).reverse()) {
    if (shouldIgnoreFile(filePath)) {
      continue;
    }

    if (!(await _fsExtra().default.stat(filePath)).isDirectory()) {
      await replaceNameInUTF8File(filePath, projectName, placeholderName);
      await replaceNameInUTF8File(filePath, projectTitle, placeholderTitle);
    }

    if (shouldRenameFile(filePath, placeholderName)) {
      await renameFile(filePath, placeholderName, projectName);
    }

    if (shouldRenameFile(filePath, placeholderName.toLowerCase())) {
      await renameFile(filePath, placeholderName.toLowerCase(), projectName.toLowerCase());
    }

    await processDotfiles(filePath);
  }
}

//# sourceMappingURL=editTemplate.js.map