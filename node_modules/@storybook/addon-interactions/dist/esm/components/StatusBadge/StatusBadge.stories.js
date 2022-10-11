import { CallStates } from '@storybook/instrumenter';
import { StatusBadge } from './StatusBadge';
export default {
  title: 'Addons/Interactions/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'padded'
  }
};
export var Pass = {
  args: {
    status: CallStates.DONE
  }
};
export var Active = {
  args: {
    status: CallStates.ACTIVE
  }
};
export var Waiting = {
  args: {
    status: CallStates.WAITING
  }
};
export var Fail = {
  args: {
    status: CallStates.ERROR
  }
};