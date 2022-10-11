import "core-js/modules/es.array.reduce.js";
import { addons } from '@storybook/addons';
import { FORCE_REMOUNT, STORY_RENDER_PHASE_CHANGED } from '@storybook/core-events';
import { instrument } from '@storybook/instrumenter';
import { ModuleMocker } from 'jest-mock';
const JestMock = new ModuleMocker(global);
const fn = JestMock.fn.bind(JestMock); // Aliasing `fn` to `action` here, so we get a more descriptive label in the UI.

const {
  action
} = instrument({
  action: fn
}, {
  retain: true
});
const channel = addons.getChannel();
const spies = [];
channel.on(FORCE_REMOUNT, () => spies.forEach(mock => {
  var _mock$mockClear;

  return mock === null || mock === void 0 ? void 0 : (_mock$mockClear = mock.mockClear) === null || _mock$mockClear === void 0 ? void 0 : _mock$mockClear.call(mock);
}));
channel.on(STORY_RENDER_PHASE_CHANGED, ({
  newPhase
}) => {
  if (newPhase === 'loading') spies.forEach(mock => {
    var _mock$mockClear2;

    return mock === null || mock === void 0 ? void 0 : (_mock$mockClear2 = mock.mockClear) === null || _mock$mockClear2 === void 0 ? void 0 : _mock$mockClear2.call(mock);
  });
});

const addActionsFromArgTypes = ({
  id,
  initialArgs
}) => {
  return Object.entries(initialArgs).reduce((acc, [key, val]) => {
    if (typeof val === 'function' && val.name === 'actionHandler') {
      Object.defineProperty(val, 'name', {
        value: key,
        writable: false
      });
      Object.defineProperty(val, '__storyId__', {
        value: id,
        writable: false
      });
      acc[key] = action(val);
      spies.push(acc[key]);
      return acc;
    }

    acc[key] = val;
    return acc;
  }, {});
};

export const argsEnhancers = [addActionsFromArgTypes];