import React from "react";
import {
  useMessages,
  useChannels,
  useSubscribe,
  useUserMemberships,
  usePresence,
  useChannelMembers,
  useUser
} from "pubnub-chat-components";
import { usePubNub } from "pubnub-react";
import "./hooks-test.css";


export default function HooksTest() {
  const introductions = "space_ac4e67b98b34b44c4a39466e93e";
  const indiaoffice = "space_515fc9a2a1a895f4059c84b2971";

  // const [showInfo, setShowInfo] = React.useState(false);
  // const [channels, setChannels] = React.useState([introductions]);

  const user = "user_00505cca5b04460fafd716af48665ca1";

  const [members, fetchMore, total, error] = useChannelMembers({ channel: introductions, include: { UUIDFields: true, customUUIDFields: true } });

  console.log('channels members: ', members)

  // const [userChannels, fetchMore, total] = useUserMemberships({ uuid: user, include: { customFields: true } });

  // useSubscribe({ channels: [user], withPresence: true });

  // const [userinfo] = useUser({ uuid: user })

  // const [channels, totalPresence] = usePresence({ channels: [introductions, indiaoffice] });

  // console.log("totalPresence: ", totalPresence);
  // console.log("channels: ", channels);


  // const [messages, fetchMoreMessages] = useMessages({
  //   channels: [introductions],
  //   count: 2,
  // });

  // const addIndiaOffice = () => {
  //   setChannels([...channels, indiaoffice]);
  // }

  // const removeOffice = () => {
  //   setChannels([indiaoffice]);
  // };

  return (
    <div className="hooks">
      {/* { users.find(u => u.id === user)?.custom.title } */}
      {/* <button onClick={() => { setShowInfo(!showInfo) }} className="gethistory">
        Show channel info
      </button>

      {showInfo && <ChannelInfo />}

      <button onClick={fetchMoreMessages} className="gethistory">
        Fetch Previous History
      </button>

      <button onClick={addIndiaOffice} className="gethistory">
        Add channel sub
      </button>

      <button onClick={removeOffice} className="gethistory">
        Remove channel sub
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
        {messages?.[indiaoffice]?.map((message: any) => (
          <p key={message.timetoken}>{message.message.text}</p>
        ))}
      </div> */}
    </div>
  );
}




function ChannelInfo() {
  const ch2 = "space_ac4e67b98b34b44c4a39466e93e";

  // useSubscribe({ channels: [ch2] });
  const [channelList, fetchMore, total, error] = useChannels({ include: { customFields: true } });
  const channelInfo = channelList.find((ch) => ch.id === ch2);

  return (
    <>
      <p>{channelInfo?.description}</p>
      <p>{error?.message}</p>
    </>
  )
}