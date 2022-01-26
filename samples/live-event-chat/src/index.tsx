import React from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import LiveEventChat from "./live-event-chat";
import faker from "@faker-js/faker";

const pubnub = new PubNub({
  publishKey: (import.meta.env?.REACT_APP_PUB_KEY as string) || "",
  subscribeKey: (import.meta.env?.REACT_APP_SUB_KEY as string) || "",
  uuid: faker.internet.userName(),
});

ReactDOM.render(
  <React.StrictMode>
    <PubNubProvider client={pubnub}>
      <LiveEventChat />
    </PubNubProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
