import { CallStates } from '@storybook/instrumenter';
import { StatusIcon } from './StatusIcon';
export default {
  title: 'Addons/Interactions/StatusIcon',
  component: StatusIcon
};
export const Pending = {
  args: {
    status: CallStates.WAITING
  }
};
export const Error = {
  args: {
    status: CallStates.ERROR
  }
};
export const Done = {
  args: {
    status: CallStates.DONE
  }
};