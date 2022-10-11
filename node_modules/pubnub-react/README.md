# PubNub React Framework

This is the official PubNub React framework repository.

PubNub takes care of the infrastructure and APIs needed for the realtime communication layer of your application. Work on your app's logic and let PubNub handle sending and receiving data across the world in less than 100ms.

* [Requirements](#requirements)
* [Get keys](#get-keys)
* [Sample app](#sample-app)
* [Documentation links](#documentation-links)
* [Reference information](#reference-information)
* [Support](#support)

## Requirements

To use the PubNub React framework, you need:

* React 16.8 or above
* PubNub [Javascript SDK](https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk).

> This library is compatible with the latest versions of the React Native framework. For examples, refer to [examples/reactnative](/examples/reactnative).

## Get keys

You will need publish and subscribe keys to authenticate your app. Get your keys from the [Admin Portal](https://dashboard.pubnub.com/).

## Sample app

Follow these instructions to set up a simple chat app using PubNub.

**Note**: These instructions assume you're using JavaScript. If you'd prefer to use TypeScript, follow the instructions in the [React framework documentation](https://www.pubnub.com/docs/chat/react/getting-started).

1. Set up your React project.

    For a quick single-page app, [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) is a good starting point:

    ```bash
    npx create-react-app react-sample-chat
    ```

1. Add the PubNub JavaScript SDK and React framework packages to your project:

    ```bash
    cd react-sample-chat
    npm install --save pubnub pubnub-react
    ```

1. Replace the contents of `src/App.js` with the following, replacing `myPublishKey` and `mySubscribeKey` with your own keys, and `myUniqueUUID` with a value of your choice:

    ```jsx
    import React, { useState, useEffect } from 'react';
    import PubNub from 'pubnub';
    import { PubNubProvider, usePubNub } from 'pubnub-react';

    const pubnub = new PubNub({
      publishKey: 'myPublishKey',
      subscribeKey: 'mySubscribeKey',
      uuid: 'myUniqueUUID'
    });

    function App() {
      return (
        <PubNubProvider client={pubnub}>
          <Chat />
        </PubNubProvider>
      );
    }

    function Chat() {
      const pubnub = usePubNub();
      const [channels] = useState(['awesome-channel']);
      const [messages, addMessage] = useState([]);
      const [message, setMessage] = useState('');

      const handleMessage = event => {
        const message = event.message;
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
          const text = message.text || message;
          addMessage(messages => [...messages, text]);
        }
      };

      const sendMessage = message => {
        if (message) {
          pubnub
            .publish({ channel: channels[0], message })
            .then(() => setMessage(''));
        }
      };

      useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
      }, [pubnub, channels]);

      return (
        <div style={pageStyles}>
          <div style={chatStyles}>
            <div style={headerStyles}>React Chat Example</div>
            <div style={listStyles}>
              {messages.map((message, index) => {
                return (
                  <div key={`message-${index}`} style={messageStyles}>
                    {message}
                  </div>
                );
              })}
            </div>
            <div style={footerStyles}>
              <input
                type="text"
                style={inputStyles}
                placeholder="Type your message"
                value={message}
                onKeyPress={e => {
                  if (e.key !== 'Enter') return;
                  sendMessage(message);
                }}
                onChange={e => setMessage(e.target.value)}
              />
              <button
                style={buttonStyles}
                onClick={e => {
                  e.preventDefault();
                  sendMessage(message);
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      );
    }

    const pageStyles = {
      alignItems: 'center',
      background: '#282c34',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
    };

    const chatStyles = {
      display: 'flex',
      flexDirection: 'column',
      height: '50vh',
      width: '50%',
    };

    const headerStyles = {
      background: '#323742',
      color: 'white',
      fontSize: '1.4rem',
      padding: '10px 15px',
    };

    const listStyles = {
      alignItems: 'flex-start',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'auto',
      padding: '10px',
    };

    const messageStyles = {
      backgroundColor: '#eee',
      borderRadius: '5px',
      color: '#333',
      fontSize: '1.1rem',
      margin: '5px',
      padding: '8px 15px',
    };

    const footerStyles = {
      display: 'flex',
    };

    const inputStyles = {
      flexGrow: 1,
      fontSize: '1.1rem',
      padding: '10px 15px',
    };

    const buttonStyles = {
      fontSize: '1.1rem',
      padding: '10px 15px',
    };

    export default App;
    ```

1. In your project, run the following command:

    ```bash
    npm start
    ```

    You should see the following in your browser:
    ![chat UI screenshot](./assets/quickstart-screenshot.png)

### Add listeners

In the code in the previous section, the following adds a message listener in the `Chat()` function:

```javascript
      useEffect(() => {
        pubnub.addListener({ message: handleMessage });
        pubnub.subscribe({ channels });
      }, [pubnub, channels]);
```

### Publish and subscribe

Publishing a message:

```javascript
const [channels] = useState(['awesome-channel']);

// ...

const sendMessage = message => {
  if (message) {
    pubnub
      .publish({ channel: channels[0], message })
      .then(() => setMessage(''));
  }
};
```

Subscribing to a channel:

```javascript
const [channels] = useState(['awesome-channel']);

// ...

useEffect(() => {
  pubnub.addListener({ message: handleMessage });
  pubnub.subscribe({ channels });
}, [pubnub, channels]);
```

## Documentation links

* [React framework documentation](https://www.pubnub.com/docs/chat/react/setup)
* [JavaScript SDK documentation](https://www.pubnub.com/docs/web-javascript/pubnub-javascript-sdk)
* [PubNub React/Redux team chat app](https://pubnub.github.io/typescript-ref-app-team-chat/docs/introduction)

## Reference information

* [PubNubConsumer](#pubnubconsumer)
* [PubNubProvider](#pubnubprovider)
* [usePubNub hook](#usepubnub-hook)

### PubNubProvider

The PubNubProvider makes available a PubNub client instance to a React component tree. You instantiate the provider as follows (note that this example assumes that your publish and subscribe keys are contained in the `pubnub.config.json` file):

```js
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

const pubNubConfig = require('./pubnub.config.json');
const pubNubClient = new PubNub(pubNubConfig.Demo.keySet);

const App = () => {
  return (
    <PubNubProvider client={pubNubClient}>
      <MyRootComponent />
    </PubNubProvider>
  );
};

export default App;
```

#### PubNubProvider props

The PubNubProvider component takes a single prop:

* **client** is the required pubNubClient instance. This is used by all components that require PubNub functionality.

### usePubNub hook

The PubNub hook lets you interact with PubNub in function components.

Hooks are a new feature added in React 16.8 that allow you to use React features without writing a class. For a general overview of hooks, refer to [the React documentation](https://reactjs.org/docs/hooks-intro.html).


#### Example `usePubNub` hook usage

```javascript
import React, { useState, useEffect } from 'react';
import { usePubNub } from '../../src/index';

const PubNubTime = () => {
  const client = usePubNub();
  const [time, setTime] = useState(null);
  const [error, setError] = useState(error);

  useEffect(() => {
    client
      .time()
      .then(({ timetoken }) => {
        setTime(timetoken);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  if (error !== null) {
    return <div>An error has occured: {error.message}</div>;
  }

  if (time === null) {
    return <div>Loading...</div>;
  }

  return <div>Current time: {time}</div>;
};

export default PubNubTime;
```

Then, to load `PubNubTime` on-demand, you could use `React.Lazy` and `Suspense`:

```javascript
import React, { Suspense, lazy } from 'react';

const MyRootComponent = () => {
  const DisplayPubNubTime = lazy(() => import('./PubNubTime'));

  return (
    <Suspense fallback={<div>Loading. . .</div>}>
      <DisplayPubNubTime />
    </Suspense>
  );
};

export default MyRootComponent;
```

### PubNubConsumer

The PubNubConsumer allows you to access the client instance you made available with a PubNubProvider.

> **Note**: Be careful, as the children function will be called every time component rerenders. Wrap components using PubNubConsumer using `React.memo` to prevent this behaviour.

#### PubNubConsumer props

The PubNubConsumer component takes a single prop:

* **client** is the required PubNub Client instance. This is used by all components that require PubNub functionality.

#### Example PubNubConsumer usage

Once you've created a PubNubProvider, you can access the client with a PubNubConsumer.

```js
import React from 'react';
import PubNub from 'pubnub';
import { PubNubProvider } from '../PubNubProvider';
import { PubNubConsumer } from '../PubNubConsumer';
import { getPubNubContext } from '../PubNubContext';

const pubNubConfig = require('../config/pubnub.json');
const pubNubClient = new PubNub(pubNubConfig.Demo.keySet);

const App = () => {
  return (
    <PubNubProvider client={pubNubClient}>
      <PubNubConsumer>
        {client => 'success!' /* do something now */}
      </PubNubConsumer>
    </PubNubProvider>
  );
};
```

## Support

If you **need help** or have a **general question**, contact support@pubnub.com.
