import React from "react";
import PubNub from "pubnub";
import ReactDOM from "react-dom";
import { PubNubProvider } from "pubnub-react";
import { HashRouter, Switch, Route, Link } from "react-router-dom";

import SimpleChat from "./simple-chat/simple-chat";
import EventChat from "./event-chat/event-chat";
import GroupChat from "./group-chat/group-chat";
import ModeratedChat from "./moderated-chat/moderated-chat";
import "./index.css";

import pubnubKeys from "../pubnub-keys.json";
import users from "../../data/users.json";

/**
 * Prepare a PubNub instance and inject it into PubNubProvider
 * You should generate your own keyset on pubnub.com and paste it into pubnub-keys.json
 */
const pubnub = new PubNub({
  ...pubnubKeys,
  uuid: users[Math.floor(Math.random() * users.length)].id,
});

/** Detect PubNub access manager */
let pamEnabled = false;
pubnub.addListener({
  status: function (status) {
    if (status.category === "PNAccessDeniedCategory") {
      pamEnabled = true;
      renderApp();
    }
  },
});

const SampleApps = () => {
  return (
    <PubNubProvider client={pubnub}>
      <HashRouter>
        <Switch>
          <Route path="/group-chat">
            <GroupChat />
          </Route>
          <Route path="/event-chat">
            <EventChat />
          </Route>
          <Route path="/simple-chat">
            <SimpleChat />
          </Route>
          <Route path="/moderated-chat">
            <ModeratedChat />
          </Route>
          <Route path="/">
            <div className="welcome">
              <h1>Pubnub Chat Components</h1>
              <h3>Here are some example applications built using PubNub and Chat Components:</h3>
              <ul>
                <li>
                  <Link to="/simple-chat">Simple Chat</Link>
                </li>
                <li>
                  <Link to="/moderated-chat">Moderated Chat</Link>
                </li>
              </ul>
            </div>
          </Route>
        </Switch>
      </HashRouter>
    </PubNubProvider>
  );
};

const PamError = () => {
  return (
    <div className="pubnub-error">
      <h1>Warning! PubNub access manager enabled.</h1>
      <p>
        It looks like you have access manager enabled on your PubNub keyset. This sample app is not
        adapted to work with PAM by default.
      </p>
      <p>
        You can either disable PAM in the{" "}
        <a href="https://dashboard.pubnub.com/">PubNub Admin Portal</a> or add custom code to grant
        all necessary permissions by yourself. Please referer to the{" "}
        <a href="https://pubnub.github.io/react-chat-components/docs/?path=/story/introduction-pam--page">
          Chat Component docs
        </a>{" "}
        for more information.
      </p>
    </div>
  );
};

const KeysError = () => {
  return (
    <div className="pubnub-error">
      <h1>A PubNub account is required.</h1>
      <p>
        Visit the PubNub dashboard to create an account or login:
        <br />
        <a href="https://dashboard.pubnub.com/">https://dashboard.pubnub.com/</a>
        <br />
        Create a new app or locate your app in the dashboard. Enable the Presence, Files, Objects,
        and Storage features using a region of your choosing. For Objects, ensure the following are
        enabled:
      </p>
      <ul>
        <li>User Metadata Events</li>
        <li>Channel Metadata Events</li>
        <li>Membership Events</li>
      </ul>
      <p>Copy and paste your publish key and subscribe key into: </p>
      <pre>pubnub-keys.json</pre>
      <p>before continuing.</p>
    </div>
  );
};

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      {pubnubKeys.publishKey.length && pubnubKeys.subscribeKey.length ? (
        pamEnabled ? (
          <PamError />
        ) : (
          <SampleApps />
        )
      ) : (
        <KeysError />
      )}
    </React.StrictMode>,
    document.getElementById("root")
  );
};

renderApp();
