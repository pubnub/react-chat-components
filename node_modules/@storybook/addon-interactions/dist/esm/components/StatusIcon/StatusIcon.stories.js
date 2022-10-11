import { CallStates } from '@storybook/instrumenter';
import { StatusIcon } from './StatusIcon';
export default {
  title: 'Addons/Interactions/StatusIcon',
  component: StatusIcon
};
export var Pending = {
  args: {
    status: CallStates.WAITING
  }
};
export var Error = {
  args: {
    status: CallStates.ERROR
  }
};
export var Done = {
  args: {
    status: CallStates.DONE
  }
};