import React from "react";
import PubNub from "pubnub";
import "./event-chat.css";
import { Chat, MessageList, MessageInput } from "pubnub-chat-components";

const userIds = [
  "user_00505cca5b04460fafd716af48665ca1",
  "user_00c56e75c0334ff0b248ca4292d20de3",
  "user_0149372b160544cf981b6284dd2b5e45",
  "user_0202a46151cc43af890caa521c40576e",
  "user_0368d27f4d514079bc5cfd5678ec1fe7",
  "user_03bcea398fd6441c8f982abbdc94ef75",
  "user_05f4ac447efc478c834e53ba0cb34444",
  "user_0a0579891c7148009ec254f7ae2e6367",
  "user_0b253029175b4ebb8b03c4281757406b",
  "user_102a15c8bc394bdc90d1c8eab58b1de9",
  "user_142da3c419804a82a3057cedc86acaa6",
];

const channels = ["polsatgames2", "izakooo", "dota2ruhub"];

const pubnub = new PubNub({
  publishKey: "pub-c-2e4f37a4-6634-4df6-908d-32eb38d89a1b",
  subscribeKey: "sub-c-1456a186-fd7e-11ea-ae2d-56dc81df9fb5",
  uuid: userIds[Math.floor(Math.random() * userIds.length)],
});

function EventChat() {
    // const theme = "light";
    const theme = "event-dark";
    // const theme = "event";
    const [channel, setChannel] = React.useState(channels[0]);
    return (
      <div className="event-app">
        <Chat {...{ pubnub, channel, theme }}>
          <div className="event-main">
            <div className="event-channels">
              Popular channels:
              {channels.map((channel) => (
                <span className="event-link" onClick={() => setChannel(channel)}>
                  {channel}
                </span>
              ))}
            </div>
            <div className="event">
              <iframe
                src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
                frameBorder="0"
                allowFullScreen={true}
                scrolling="no"
                title="Stream"
              />
              <div className="event-chat">
                <MessageList />
                <MessageInput />
              </div>
            </div>
          </div>
        </Chat>
      </div>
    );
}

export default EventChat;
