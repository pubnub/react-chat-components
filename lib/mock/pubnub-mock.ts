import type {
  ListenerParameters,
  MessageAction,
  FetchMessagesResponse,
  HereNowResponse,
  PublishResponse,
  SignalResponse,
  SendFileResponse,
} from "pubnub";
import { VSPPubnub } from "../src/types";
import users from "../../data/users/users.json";
import messages from "../../data/messages/lorem.json";
import channels from "../../data/channels/work.json";

export interface PubNubMockOptions {
  uuid?: string;
  returnedUuid?: string;
}

export function PubNubMock(options: PubNubMockOptions = {}): Partial<VSPPubnub> & { _config: any } {
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

  const removeListener = (obj) => {
    Object.keys(obj).forEach((key) => delete listeners[key]);
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

  const hereNow = (options) => {
    return new Promise<HereNowResponse>((resolve) => {
      resolve({
        totalChannels: options.channels.length,
        totalOccupancy: options.channels.length * users.length,
        channels: options.channels
          .map((channel) => ({
            name: channel,
            occupancy: users.length,
            occupants: users.map((u) => ({ uuid: u.id })),
          }))
          .reduce((obj, item) => ({ ...obj, [item["name"]]: item }), {}),
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

  const objects = {
    getAllUUIDMetadata: (options) => {
      const limit = options.limit || users.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: users.slice(offset, offset + limit),
        totalCount: users.length,
        next: page + 1,
      };
    },
    getAllChannelMetadata: (options) => {
      const limit = options.limit || channels.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: channels.slice(offset, offset + limit),
        totalCount: channels.length,
        next: page + 1,
      };
    },
    getChannelMembers: (options) => {
      const limit = options.limit || users.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: users.slice(offset, offset + limit).map((u) => ({ uuid: u })),
        totalCount: users.length,
        next: page + 1,
      };
    },
    getMemberships: (options) => {
      const limit = options.limit || channels.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: channels.slice(offset, offset + limit).map((c) => ({ channel: c })),
        totalCount: channels.length,
        next: page + 1,
      };
    },
    getUUIDMetadata: (args) => ({
      status: 200,
      data: users.find((u) => u.id === args.uuid),
    }),
  };

  const fetchMemberships = (options) => {
    if (options.spaceId) {
      const limit = options.limit || users.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: users.slice(offset, offset + limit).map((u) => ({ user: u })),
        totalCount: users.length,
        next: page + 1,
      };
    } else {
      const limit = options.limit || channels.length;
      const page = options.page.next || 0;
      const offset = page * limit;

      return {
        status: 200,
        data: channels.slice(offset, offset + limit).map((c) => ({ space: c })),
        totalCount: channels.length,
        next: page + 1,
      };
    }
  };

  return {
    addMessageAction,
    addListener,
    fetchMessages,
    fetchUser: objects.getUUIDMetadata,
    fetchUsers: objects.getAllUUIDMetadata,
    fetchMemberships,
    fetchSpaces: objects.getAllChannelMetadata,
    getFileUrl,
    getUUID,
    getSubscribedChannels,
    getSubscribedChannelGroups,
    hereNow,
    publish,
    removeListener,
    removeMessageAction,
    signal,
    sendFile,
    stop: () => true,
    subscribe: () => true,
    objects,
    unsubscribe: () => true,
    _config: {
      _addPnsdkSuffix: () => true,
    },
  };
}
