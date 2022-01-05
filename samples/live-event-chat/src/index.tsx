import React from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import LiveEventChat from "./live-event-chat";

const nicknames = [
  "habar3666",
  "Akomi",
  "Caxaguru",
  "vika2121",
  "NiceLady",
  "HamYai",
  "Asala",
  "andreir45",
  "Kost9In",
  "CyperAmf",
  "Crimsonv",
  "TimurENOK",
  "NCISWOJ",
  "EnterShik",
  "Dzigaro",
  "FunEskimo",
  "warLordVS",
  "k0n1g",
  "Marylose",
];
const name = nicknames[Math.floor(Math.random() * nicknames.length)];
const id = name.toLowerCase();
const user = {
  name,
  id,
  profileUrl: `https://avatars.dicebear.com/api/personas/${id}.svg`,
  eTag: "",
  updated: "",
};

const pubnub = new PubNub({
  publishKey: (import.meta.env?.REACT_APP_PUB_KEY as string) || "",
  subscribeKey: (import.meta.env?.REACT_APP_SUB_KEY as string) || "",
  uuid: id,
});

ReactDOM.render(
  <React.StrictMode>
    <PubNubProvider client={pubnub}>
      <LiveEventChat user={user} />
    </PubNubProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
