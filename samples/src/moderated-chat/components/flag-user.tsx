import { Message } from "@pubnub/react-chat-components";
import { ObjectCustom, SetUUIDMetadataParameters, UUIDMetadataObject } from "pubnub";
import { usePubNub } from "pubnub-react";
import { useContext, useState } from "react";
import { TextField } from "@pubnub/react-chat-components";
import { ThemeContext } from "../theme";
import { UserCustom } from "../types";
import { Picker } from "emoji-mart";

export function FlagUser({
  setModalState,
  sender,
  currentUser,
}: {
  setModalState: (state: boolean) => void;
  message: Message;
  sender: UUIDMetadataObject<ObjectCustom>;
  currentUser: string;
}) {
  const pubnub = usePubNub();
  const { value: theme } = useContext(ThemeContext);
  const [text, setText] = useState("");

  const flag = async () => {
    // currently not handling errors
    // if using PAM, replace this with a call to your authorization server
    await pubnub.objects
      .setUUIDMetadata<UserCustom>({
        uuid: sender.id,
        data: {
          custom: {
            flag: true,
            flaggedAt: new Date().toISOString(),
            flaggedBy: currentUser,
            reason: text,
          },
        },
      } as SetUUIDMetadataParameters<UserCustom>)
      .catch(console.error);
    setModalState(false);
    setText("");
  };

  return (
    <div className="file-preview">
      <div>
        <img src={sender.profileUrl || ""} alt={`${sender.name}'s avatar`} />
        <div className="name">{sender.name}</div>
      </div>
      <div className="description">Reason for flagging</div>
      <TextField
        emojiPicker={<Picker />}
        theme={theme}
        text={text}
        onChange={setText}
        onSubmit={flag}
        hideSendButton
        placeholder=""
      />
      <div className="modal_actions">
        <button
          onClick={() => {
            setModalState(false);
            setText("");
          }}
        >
          Cancel
        </button>
        <button className="cta" onClick={flag}>
          Submit
        </button>
      </div>
    </div>
  );
}

export function FlagUserButton() {
  return <span>⚑</span>;
}
