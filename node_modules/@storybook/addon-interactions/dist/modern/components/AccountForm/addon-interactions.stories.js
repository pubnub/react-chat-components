import { expect } from '@storybook/jest';
import { within, waitFor, fireEvent, userEvent, waitForElementToBeRemoved } from '@storybook/testing-library';
import React from 'react';
import { AccountForm } from './AccountForm';
export default {
  title: 'Addons/Interactions/AccountForm',
  component: AccountForm,
  parameters: {
    layout: 'centered',
    theme: 'light',
    options: {
      selectedPanel: 'storybook/interactions/panel'
    }
  },
  argTypes: {
    onSubmit: {
      action: true
    }
  }
};
export const Demo = args => /*#__PURE__*/React.createElement("button", {
  type: "button",
  onClick: () => args.onSubmit('clicked')
}, "Click");

Demo.play = async ({
  args,
  canvasElement
}) => {
  await userEvent.click(within(canvasElement).getByRole('button'));
  await expect(args.onSubmit).toHaveBeenCalledWith(expect.stringMatching(/([A-Z])\w+/gi));
};

export const FindBy = args => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);
  return isLoading ? /*#__PURE__*/React.createElement("div", null, "Loading...") : /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, "Loaded!");
};

FindBy.play = async ({
  canvasElement
}) => {
  const canvas = within(canvasElement);
  await canvas.findByRole('button');
  await expect(true).toBe(true);
};

export const WaitFor = args => /*#__PURE__*/React.createElement("button", {
  type: "button",
  onClick: () => setTimeout(() => args.onSubmit('clicked'), 100)
}, "Click");

WaitFor.play = async ({
  args,
  canvasElement
}) => {
  await userEvent.click(await within(canvasElement).findByText('Click'));
  await waitFor(async () => {
    await expect(args.onSubmit).toHaveBeenCalledWith(expect.stringMatching(/([A-Z])\w+/gi));
    await expect(true).toBe(true);
  });
};

export const WaitForElementToBeRemoved = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);
  return isLoading ? /*#__PURE__*/React.createElement("div", null, "Loading...") : /*#__PURE__*/React.createElement("button", {
    type: "button"
  }, "Loaded!");
};

WaitForElementToBeRemoved.play = async ({
  canvasElement
}) => {
  const canvas = within(canvasElement);
  await waitForElementToBeRemoved(await canvas.findByText('Loading...'), {
    timeout: 2000
  });
  const button = await canvas.findByText('Loaded!');
  await expect(button).not.toBeNull();
};

export const WithLoaders = (args, {
  loaded: {
    todo
  }
}) => {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: args.onSubmit(todo.title)
  }, "Todo: ", todo.title);
};
WithLoaders.loaders = [async () => {
  // long fake timeout
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    todo: {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false
    }
  };
}];

WithLoaders.play = async ({
  args,
  canvasElement
}) => {
  const canvas = within(canvasElement);
  const todoItem = await canvas.findByText('Todo: delectus aut autem');
  await userEvent.click(todoItem);
  await expect(args.onSubmit).toHaveBeenCalledWith('delectus aut autem');
};

export const Standard = {
  args: {
    passwordVerification: false
  }
};
export const StandardEmailFilled = Object.assign({}, Standard, {
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await fireEvent.change(canvas.getByTestId('email'), {
      target: {
        value: 'michael@chromatic.com'
      }
    });
  }
});
export const StandardEmailFailed = Object.assign({}, Standard, {
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'gert@chromatic');
    await userEvent.type(canvas.getByTestId('password1'), 'supersecret');
    await userEvent.click(canvas.getByRole('button', {
      name: /create account/i
    }));
    await canvas.findByText('Please enter a correctly formatted email address');
    expect(args.onSubmit).not.toHaveBeenCalled();
  }
});
export const StandardEmailSuccess = Object.assign({}, Standard, {
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByTestId('email'), 'michael@chromatic.com');
    await userEvent.type(canvas.getByTestId('password1'), 'testpasswordthatwontfail');
    await userEvent.click(canvas.getByTestId('submit'));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledTimes(1);
      await expect(args.onSubmit).toHaveBeenCalledWith({
        email: 'michael@chromatic.com',
        password: 'testpasswordthatwontfail'
      });
    });
  }
});
export const StandardPasswordFailed = Object.assign({}, Standard, {
  play: async context => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdf');
    await userEvent.click(canvas.getByTestId('submit'));
  }
});
export const StandardFailHover = Object.assign({}, StandardPasswordFailed, {
  play: async context => {
    const canvas = within(context.canvasElement);
    await StandardPasswordFailed.play(context);
    await waitFor(async () => {
      await userEvent.hover(canvas.getByTestId('password-error-info'));
    });
  }
});
export const Verification = {
  args: {
    passwordVerification: true
  },
  argTypes: {
    onSubmit: {
      action: 'clicked'
    }
  }
};
export const VerificationPassword = Object.assign({}, Verification, {
  play: async context => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.click(canvas.getByTestId('submit'));
  }
});
export const VerificationPasswordMismatch = Object.assign({}, Verification, {
  play: async context => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);
    await userEvent.type(canvas.getByTestId('password1'), 'asdfasdf');
    await userEvent.type(canvas.getByTestId('password2'), 'asdf1234');
    await userEvent.click(canvas.getByTestId('submit'));
  }
});
export const VerificationSuccess = Object.assign({}, Verification, {
  play: async context => {
    const canvas = within(context.canvasElement);
    await StandardEmailFilled.play(context);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.type(canvas.getByTestId('password1'), 'helloyou', {
      delay: 50
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.type(canvas.getByTestId('password2'), 'helloyou', {
      delay: 50
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await userEvent.click(canvas.getByTestId('submit'));
  }
});