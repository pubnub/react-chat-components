import type PubNub from "pubnub";
import type {
  ListenerParameters,
  MessageAction,
  FetchMessagesResponse,
  HereNowResponse,
  PublishResponse,
  SignalResponse,
  SendFileResponse,
} from "pubnub";
import users from "../../data/users/users.json";
import messages from "../../data/messages/lorem.json";
import channels from "../../data/channels/work.json";

export interface PubNubMockOptions {
  uuid?: string;
  returnedUuid?: string;
}

export function PubNubMock(options: PubNubMockOptions = {}): Partial<PubNub> & { _config: any } {
  const uuid = options.uuid || "user_63ea15931d8541a3bd35e5b1f09087dc";
  const listeners: ListenerParameters = {};
  const actions = [];

  const addMessageAction = (obj) => {
    const action = {
      channel: obj.channel,
      data: {
        messageTimetoken: obj.messageTimetoken,
        actionTimetoken: Date.now() + "0000",
        type: obj.action.type,
        uuid,
        value: obj.action.value,
      },
      event: "added",
      publisher: uuid,
      timetoken: Date.now() + "0000",
    };
    actions.push(action);
    listeners.messageAction(action);
    return new Promise<{ data: MessageAction }>((resolve) => {
      resolve({ data: action.data });
    });
  };

  const addListener = (obj) => {
    Object.assign(listeners, obj);
  };

  const fetchMessages = async (args) => {
    let messagesCopy = [...messages];
    if (args.start) {
      messagesCopy = messagesCopy.filter((m) => parseInt(m.timetoken) < parseInt(args.start));
    }
    messagesCopy = messagesCopy.slice(Math.max(messagesCopy.length - args.count, 0));

    return new Promise<FetchMessagesResponse>((resolve) => {
      resolve({
        channels: {
          [args.channels[0]]: messagesCopy,
        },
      });
    });
  };

  const getFileUrl = ({ channel, id, name }) => {
    return `https://images.ctfassets.net/3prze68gbwl1/76L8lpo46Hu4WvNr9kJvkE/15bade65538769e12a12d95bff1df776/pubnub-logo-docs.svg`;
  };

  const getUUID = () => options.returnedUuid || uuid;

  const getSubscribedChannels = () => ["space.ce466f2e445c38976168ba78e46"];

  const getSubscribedChannelGroups = () => [];

  const hereNow = (args) => {
    return new Promise<HereNowResponse>((resolve) => {
      resolve({
        totalChannels: args.channels.length,
        totalOccupancy: 5,
        channels: {
          [args.channels[0]]: {
            name: args.channels[0],
            occupancy: 5,
            occupants: [
              { uuid },
              { uuid: "user_732277cad5264ed48172c40f0f008104" },
              { uuid: "user_a673547880824a0687b3041af36a5de4" },
              { uuid: "user_2ada61d287aa42b59d620c474493474f" },
              { uuid: "user_5500315bf0a34f9b9dfa0e4fffcf49c2" },
            ],
          },
        },
      });
    });
  };

  const publish = (obj) => {
    const message = {
      channel: obj.channel,
      actualChannel: obj.channel,
      subscribedChannel: obj.channel,
      message: obj.message,
      timetoken: Date.now() + "0000",
      publisher: uuid,
      subscription: null,
      uuid,
      actions: {},
    };
    messages.push(message);
    listeners.message(message);
    return new Promise<PublishResponse>((resolve) => {
      resolve({
        timetoken: parseInt(Date.now() + "0000"),
      });
    });
  };

  const removeMessageAction = (obj) => {
    const action = actions.find((a) => a.data.actionTimetoken === obj.actionTimetoken);
    const index = actions.indexOf(action);
    actions.splice(index, 1);
    action.event = "removed";
    listeners.messageAction(action);
    return new Promise<{ data: unknown }>((resolve) => {
      resolve({ data: {} });
    });
  };

  const signal = (args) => {
    listeners.signal({
      channel: args.channel,
      subscription: null,
      timetoken: Date.now() + "0000",
      message: args.message,
      publisher: uuid,
    });

    return new Promise<SignalResponse>((resolve) => {
      resolve({
        timetoken: parseInt(Date.now() + "0000"),
      });
    });
  };

  const sendFile = (args) => {
    // TODO: generate file message

    return new Promise<SendFileResponse>((resolve) => {
      resolve({
        timetoken: Date.now() + "0000",
        id: "random-file-uuid",
        name: args.file.name,
      });
    });
  };

  // const objects = {
  // getAllUUIDMetadata: () => ({
  //   data: users.map((u) => u.uuid),
  // }),
  // getAllChannelMetadata: () => ({
  //   data: channels,
  // }),
  // getChannelMembers: () => ({
  //   data: users,
  // }),
  // getMemberships: () => ({
  //   data: [
  //     { channel: { id: "space.ac4e67b98b34b44c4a39466e93e" } },
  //     { channel: { id: "space.c1ee1eda28554d0a34f9b9df5cfe" } },
  //     { channel: { id: "space.ce466f2e445c38976168ba78e46" } },
  //     { channel: { id: "space.a204f87d215a40985d35cf84bf5" } },
  //     { channel: { id: "space.149e60f311749f2a7c6515f7b34" } },
  //   ],
  // }),
  // getUUIDMetadata: (args) => ({
  //   data: users.find((u) => u.uuid.id === args.uuid).uuid,
  // }),
  // };

  return {
    addMessageAction,
    addListener,
    fetchMessages,
    getFileUrl,
    getUUID,
    getSubscribedChannels,
    getSubscribedChannelGroups,
    hereNow,
    publish,
    removeMessageAction,
    signal,
    sendFile,
    stop: () => true,
    subscribe: () => true,
    unsubscribe: () => true,
    _config: {
      _addPnsdkSuffix: () => true,
    },
  };
}
