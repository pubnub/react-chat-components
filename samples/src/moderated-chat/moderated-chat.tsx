import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Picker } from "emoji-mart";
import DarkModeToggle from "react-dark-mode-toggle";
import {
  ChannelMetadataObject,
  UUIDMetadataObject,
  ObjectCustom,
  GetAllMetadataParameters,
  ListenerParameters,
  ObjectsEvent,
  BaseObjectsEvent,
  SetUUIDMetadataParameters,
} from "pubnub";
import { usePubNub } from "pubnub-react";
import {
  ChannelList,
  Chat,
  MemberList,
  Message,
  MessageInput,
  MessageList,
  TextField,
  Themes,
  TypingIndicator,
  useChannelMembers,
  usePresence,
  useUser,
  useUserMemberships,
  useUsers,
} from "@pubnub/react-chat-components";

import "./moderated-chat.scss";
import "emoji-mart/css/emoji-mart.css";
import { ReactComponent as PeopleGroup } from "../people-group.svg";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";

interface UserCustom extends ObjectCustom {
  profileUrl: string;
  ban: boolean;
  flag: boolean;
  flaggedAt: string;
  flaggedBy: string;
  mutedChannels: string;
  blockedChannels: string;
  reason: string;
  title: string;
}

const ThemeContext = createContext<{ value: Themes; set: Dispatch<SetStateAction<Themes>> }>({
  value: "light",
  set: () => {},
});

function ModalParent() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Themes>("light");
  const [modalContent, setModalContent] = useState(<div></div>);
  return (
    <div className={`app`}>
      <ThemeContext.Provider value={{ value: theme, set: setTheme }}>
        <div className={`modal ${isOpen ? "shown" : ""} ${theme}`}>
          <div className="modal_content-area">{modalContent}</div>
        </div>
        <ModeratedChatSetup
          setModalState={setIsOpen}
          setModalContent={setModalContent}
        ></ModeratedChatSetup>
      </ThemeContext.Provider>
    </div>
  );
}

function ModeratedChat() {
  return <ModalParent></ModalParent>;
}

interface ModalConsumerProps {
  setModalState: (state: boolean) => void;
  setModalContent: (content: JSX.Element) => void;
}

function ModeratedChatSetup({ setModalState, setModalContent }: ModalConsumerProps) {
  const pubnub = usePubNub(); //usePubNub is only used here to get current user info (as it's randomly selected)
  const params = (useMemo(
    () => ({ uuid: pubnub.getUUID(), include: { channelFields: true, customChannelFields: true } }),
    [pubnub]
  ) as unknown) as GetAllMetadataParameters;

  const [rawChannels] = useUserMemberships(params);
  const [updatedChannels, setUpdatedChannels] = useState<{
    [id: string]: ChannelMetadataObject<ObjectCustom>;
  }>({});
  // need to listen for objects updates here so we can't use the chat onUser
  useEffect(() => {
    const listener: ListenerParameters = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "channel") return;

        setUpdatedChannels((channels) => {
          if (message.event === "set") {
            return merge(cloneDeep(channels), {
              [message.data.id]: message.data,
            });
          } else {
            return channels;
          }
        });
      },
    };
    // prevent updates to unmounted components
    pubnub.addListener(listener);
    return () => {
      pubnub.removeListener(listener);
    };
  });

  // apply the updates to the channels from the memberships call
  const channels = useMemo(
    () =>
      rawChannels.map((c) =>
        updatedChannels.hasOwnProperty(c.id) ? merge(c, updatedChannels[c.id]) : c
      ),
    [rawChannels, updatedChannels]
  );
  const [currentUser] = useUser(params) as [UUIDMetadataObject<UserCustom>, Error];

  if (channels.length < 1 || !currentUser) {
    return <div></div>;
  }

  return (
    <ModeratedChatContent
      channels={channels}
      currentUser={currentUser}
      setModalContent={setModalContent}
      setModalState={setModalState}
    />
  );
}

function FileUpload({
  file,
  setModalState,
  channel,
}: {
  file: File;
  setModalState: (state: boolean) => void;
  channel: string;
}) {
  const pubnub = usePubNub();
  const [image, setImage] = useState("");
  const { value: theme } = useContext(ThemeContext);
  const [text, setText] = useState("");
  // read the file to a data URL
  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // this is safe because we only use readAsDataURL
        const dataURL = e.target?.result as string;
        setImage(dataURL);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const e = Math.floor(Math.log(file.size) / Math.log(1024));
  const size = (file.size / Math.pow(1024, e)).toFixed(1) + " " + " KMGTP".charAt(e) + "B";

  const send = async () => {
    // currently not handling files too big
    await pubnub
      .sendFile({
        file,
        channel,
        message: { text: text.length > 0 ? text : undefined },
      })
      .catch(console.error);
    setModalState(false);
    setText("");
  };

  return (
    <div className="file-preview">
      <img src={image} alt="file preview" />
      <div className="filename">
        {file.name} ({size})
      </div>
      <div className="description">
        Description <span>(optional)</span>
      </div>
      <TextField
        emojiPicker={<Picker />}
        theme={theme}
        text={text}
        onChange={setText}
        onSubmit={send}
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
        <button className="cta" onClick={send}>
          Upload
        </button>
      </div>
    </div>
  );
}

function FilePickerButton({
  id,
  channel,
  setModalState,
  setModalContent,
}: { id: string; channel: string } & ModalConsumerProps) {
  const showModal: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setModalState(true);
    setModalContent(
      <FileUpload
        file={(e.target?.files || [])[0]}
        channel={channel}
        setModalState={setModalState}
      />
    );
  };
  return (
    <div className="file-picker">
      <label htmlFor={`${id}_file`}>+</label>
      <input type="file" id={`${id}_file`} name="file" onChange={showModal}></input>
    </div>
  );
}

function FlagUser({
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

function FlagUserButton() {
  return <span>⚑</span>;
}

function ModeratedChatContent({
  currentUser,
  channels,
  setModalContent,
  setModalState,
}: {
  channels: ChannelMetadataObject<ObjectCustom>[];
  currentUser: UUIDMetadataObject<UserCustom>;
} & ModalConsumerProps) {
  const [showMembers, setShowMembers] = useState(false);
  const [showChannels, setShowChannels] = useState(true);
  const { value: theme, set: setTheme } = useContext(ThemeContext);

  // memoize these values to prevent re-renders
  const socialChannelList = useMemo(() => channels.filter((c) => c.id.startsWith("space_")), [
    channels,
  ]);
  const directChannelList = useMemo(() => channels.filter((c) => c.id.startsWith("direct_")), [
    channels,
  ]);
  const allChannelIds = useMemo(() => channels.map((c) => c.id), [channels]);

  const [presenceData] = usePresence({ channels: allChannelIds }); // usePresence is one of the custom hooks provided by Chat Components
  const [currentChannel, setCurrentChannel] = useState(socialChannelList[0]);

  const [, , membershipCount] = useChannelMembers({ channel: currentChannel.id, limit: 1 });

  const [usersRaw] = useUsers({
    include: {
      customFields: true,
    },
  });

  const [usersUpdated, setUsersUpdated] = useState<{
    [id: string]: UUIDMetadataObject<UserCustom>;
  }>({});

  const onUser = (event: BaseObjectsEvent) => {
    const message = (event as ObjectsEvent).message;
    if (message.type !== "uuid") return;

    setUsersUpdated((channels) => {
      if (message.event === "set") {
        return merge(cloneDeep(channels), {
          [message.data.id]: message.data,
        });
      } else {
        return channels;
      }
    });
  };

  const users = useMemo(
    () =>
      usersRaw.map((u) => (usersUpdated.hasOwnProperty(u.id) ? merge(u, usersUpdated[u.id]) : u)),
    [usersRaw, usersUpdated]
  ) as UUIDMetadataObject<UserCustom>[];

  currentUser = users.find((u) => u.id === currentUser.id) || currentUser;

  // permissions
  // using PAM for moderation will enforce these rules server side
  // if using PAM, the moderation state can be removed from the object metadata and stored elsewhere
  const muted = (currentUser.custom?.mutedChannels || "").split(",").includes(currentChannel.id);
  const blocked = (currentUser.custom?.blockedChannels || "")
    .split(",")
    .includes(currentChannel.id);
  const banned = currentUser.custom?.ban === true;

  let placeholder: string | undefined = undefined;
  if (banned) {
    placeholder = "You have been banned.";
  } else if (blocked) {
    placeholder = "You do not have permission to send or view messages.";
  } else if (muted) {
    placeholder = "You do not have permission to send messages.";
  }
  const canRead = !(blocked || banned);
  const canWrite = !(blocked || muted || banned);

  const presentUUIDs = presenceData[currentChannel?.id]?.occupants?.map((o) => o.uuid);
  const presentUsers = useMemo(
    () => users.filter((u) => presentUUIDs?.includes(u.id) && u.custom?.ban !== true),
    [presentUUIDs, users]
  );

  const showFlagUserModal = (message: Message, sender: UUIDMetadataObject<ObjectCustom>) => {
    setModalState(true);
    setModalContent(
      <FlagUser
        currentUser={currentUser.id}
        message={message}
        sender={sender}
        setModalState={setModalState}
      />
    );
  };

  /** Rendered markup is a mixture of PubNub Chat Components (Chat, ChannelList, MessageList,
   * MessageInput, MemberList) and some elements to display additional information and to handle
   * custom behaviors (dark mode, showing/hiding panels, responsive design) */
  return (
    <div className={`app-simple ${theme}`}>
      {/* Be sure to wrap Chat component in PubNubProvider from pubnub-react package.
      In this case it's done in the index.tsx file */}
      <Chat
        theme={theme}
        users={users}
        currentChannel={currentChannel.id}
        channels={allChannelIds}
        onUser={onUser}
      >
        <div className={`channels ${showChannels && "shown"}`}>
          <div className="user">
            {currentUser?.profileUrl && <img src={currentUser?.profileUrl} alt="User avatar " />}
            <h4>
              {currentUser?.name}{" "}
              <span className="close" onClick={() => setShowChannels(false)}>
                ✕
              </span>
            </h4>
          </div>
          <h4>Channels</h4>
          <div>
            <ChannelList
              channels={socialChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
          <h4>Direct Chats</h4>
          <div>
            <ChannelList
              channels={directChannelList}
              onChannelSwitched={(channel) => setCurrentChannel(channel)}
            />
          </div>
          <div className="toggle">
            <span>Dark Mode</span>
            <DarkModeToggle
              size={50}
              checked={theme === "dark"}
              onChange={(isDark) => (isDark ? setTheme("dark") : setTheme("light"))}
            />
          </div>
        </div>

        <div className="chat">
          <div
            className={`people ${showMembers ? "active" : ""}`}
            onClick={() => setShowMembers(!showMembers)}
          >
            <span>
              <strong>{presentUsers.length || 0}</strong>
              {membershipCount ? <span>/{membershipCount}</span> : ""}
            </span>
            <PeopleGroup />
          </div>

          <div className="info">
            <span className="hamburger" onClick={() => setShowChannels(true)}>
              ☰
            </span>
            <h4>{currentChannel.name}</h4>
            <small>{currentChannel.description}</small>
            <hr />
          </div>
          {canRead ? (
            <MessageList
              fetchMessages={canRead ? 20 : 0}
              enableReactions={canRead}
              reactionsPicker={canWrite ? <Picker /> : undefined}
              additionalActions={[{ component: <FlagUserButton />, onClick: showFlagUserModal }]}
            >
              <TypingIndicator showAsMessage />
            </MessageList>
          ) : (
            <div style={{ width: "100%", height: "100%" }}></div>
          )}
          <MessageInput
            typingIndicator
            emojiPicker={<Picker />}
            disabled={!canWrite}
            placeholder={placeholder}
            additionalActions={[
              {
                component: (
                  <FilePickerButton
                    id="0"
                    channel={currentChannel.id}
                    setModalContent={setModalContent}
                    setModalState={setModalState}
                  />
                ),
                // use native file picker functionality
                onClick: () => {},
              },
            ]}
          />
        </div>

        <div className={`members ${showMembers && "shown"}`}>
          <h4>
            Online Users
            <span className="close" onClick={() => setShowMembers(false)}>
              ✕
            </span>
          </h4>
          <MemberList members={presentUsers} />
        </div>
      </Chat>
    </div>
  );
}

export default ModeratedChat;
