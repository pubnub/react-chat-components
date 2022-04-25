import React, { useState } from "react";
import ReactDOM from "react-dom";
import PubNub, { ChannelMetadataObject, ObjectCustom } from "pubnub";
import { PubNubProvider } from "pubnub-react";
import faker from "@faker-js/faker";
import { Chat, usePresence } from "@pubnub/react-chat-components";
import { eventChannels } from "@pubnub/react-chat-data";

import StreamView from "./components/StreamView";
import ChannelsView from "./components/ChannelsView";
import ChatView from "./components/ChatView";

import "./index.css";

const pubnub = new PubNub({
  publishKey: (import.meta.env?.REACT_APP_PUB_KEY as string) || "",
  subscribeKey: (import.meta.env?.REACT_APP_SUB_KEY as string) || "",
  uuid: faker.internet.userName(),
});

const channels: ChannelMetadataObject<ObjectCustom>[] = eventChannels;

const LiveEventChat = (): JSX.Element => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [presence] = usePresence({ channels: channels.map((ch) => ch.id) });
  const channelOccupants = presence[currentChannel.id]?.occupants;
  const channelOccupancy = presence[currentChannel.id]?.occupancy;

  return (
    <main className={`flex ${darkMode ? "dark" : "light"}`}>
      <Chat
        currentChannel={currentChannel.id}
        /** Manually pass '-pnpres' channels here to get presence data for channels you don't want to be subscribed to */
        channels={[currentChannel.id, ...channels.map((ch) => `${ch.id}-pnpres`)]}
      >
        <ChannelsView {...{ channels, darkMode, presence, setCurrentChannel, setDarkMode }} />
        <StreamView {...{ channelOccupancy, currentChannel }} />
        <ChatView {...{ channelOccupants, darkMode }} />
      </Chat>
    </main>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <PubNubProvider client={pubnub}>
      <LiveEventChat />
    </PubNubProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
