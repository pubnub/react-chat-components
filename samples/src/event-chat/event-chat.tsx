import React from "react";
import { Chat, MessageList, MessageInput, useUser, usePresence } from "pubnub-chat-components";
import { ReactComponent as PeopleGroup } from "../people-group.svg";
import "./event-chat.css";

const channels = ["polsatgames2", "izakooo", "dota2ruhub"];

function EventChat() {
  const [channel, setChannel] = React.useState(channels[0]);
  const [user] = useUser();
  // eslint-disable-next-line
  const [presence, total] = usePresence({ channels: [channel] });

  return (
    <div className="event-app">
      <Chat {...{ channel, theme: "event-dark", userList: [user] }}>
        <div className="event-main">
          <div className="event-channels">
            Join a channel:
            {channels.map((channel) => (
              <span key={channel} className="event-link" onClick={() => setChannel(channel)}>
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
          </div>

          <div className="event-info">
            <div className="event-avatar"></div>
            <div>
              <h3>{channel}</h3>
              <small>Additional channel info</small>
            </div>
          </div>

          <div className="event-text">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
              sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
              amet.
            </p>
            <p>
              Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
              exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
              consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
              nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
              pariatur?"
            </p>
          </div>
        </div>

        <div className="event-chat">
          <div className="event-people">
            <span>Logged in as: {user?.name}</span>
            <span>
              {total} <PeopleGroup />
            </span>
          </div>
          <MessageList welcomeRenderer={false} />
          <MessageInput emojiPicker hideSendButton senderInfo />
        </div>
      </Chat>
    </div>
  );
}

export default EventChat;
