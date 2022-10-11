import { expect } from '@storybook/jest';
import { CallStates } from '@storybook/instrumenter';
import { userEvent, within } from '@storybook/testing-library';
import { getCall } from '../../mocks';
import { Interaction } from './Interaction';
import SubnavStories from '../Subnav/Subnav.stories';
export default {
  title: 'Addons/Interactions/Interaction',
  component: Interaction,
  args: {
    callsById: new Map(),
    controls: SubnavStories.args.controls,
    controlStates: SubnavStories.args.controlStates
  }
};
export const Active = {
  args: {
    call: getCall(CallStates.ACTIVE)
  }
};
export const Waiting = {
  args: {
    call: getCall(CallStates.WAITING)
  }
};
export const Failed = {
  args: {
    call: getCall(CallStates.ERROR)
  }
};
export const Done = {
  args: {
    call: getCall(CallStates.DONE)
  }
};
export const Disabled = {
  args: Object.assign({}, Done.args, {
    controlStates: Object.assign({}, SubnavStories.args.controlStates, {
      goto: false
    })
  })
};
export const Hovered = Object.assign({}, Done, {
  parameters: {
    // Set light theme to avoid stacked theme in chromatic
    theme: 'light'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
    await expect(canvas.getByTestId('icon-active')).not.toBeNull();
  }
});