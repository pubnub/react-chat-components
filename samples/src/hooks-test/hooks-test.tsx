import React from "react";
import { usePubNubMessages } from "pubnub-chat-components";
import "./hooks-test.css";

const introductions = "space_ac4e67b98b34b44c4a39466e93e";
const movies = "space_149e60f311749f2a7c6515f7b34";

export default function HooksTest() {
  const [messages, fetchMoreMessages] = usePubNubMessages({
    channels: [introductions, movies],
    count: 2,
  });

  return (
    <div className="hooks">
      <button onClick={fetchMoreMessages} className="gethistory">
        Fetch Previous History
      </button>

      <div className="channel">
        <p>
          <strong>Channel 1:</strong>
        </p>
        {messages?.[introductions]?.map((message: any) => (
          <p key={message.timetoken}>{message.message.text}</p>
        ))}
      </div>

      <div className="channel">
        <p>
          <strong>Channel 2:</strong>
        </p>
        {messages?.[movies]?.map((message: any) => (
          <p key={message.timetoken}>{message.message.text}</p>
        ))}
      </div>
    </div>
  );
}