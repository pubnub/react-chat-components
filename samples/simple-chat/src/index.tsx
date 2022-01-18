import React from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import SimpleChat from "./simple-chat";
import users from "../../../data/users.json";

const pubnub = new PubNub({
  publishKey: import.meta.env.REACT_APP_PUB_KEY,
  subscribeKey: import.meta.env.REACT_APP_SUB_KEY,
  uuid: users[Math.floor(Math.random() * users.length)].id,
});

ReactDOM.render(
  <React.StrictMode>
    <PubNubProvider client={pubnub}>
      <SimpleChat />
    </PubNubProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
