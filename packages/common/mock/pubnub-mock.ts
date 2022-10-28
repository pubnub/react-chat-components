import type {
  ListenerParameters,
  MessageAction,
  FetchMessagesResponse,
  HereNowResponse,
  PublishResponse,
  SignalResponse,
  SendFileResponse,
  MessageActionEvent,
  AddMessageActionParameters,
  FetchMessagesParameters,
  HereNowParameters,
  PublishParameters,
  SignalParameters,
  GetAllMetadataParameters,
  GetUUIDMetadataParameters,
  RemoveMessageActionParameters,
  SendFileParameters,
} from "pubnub";
import {
  users,
  loremMessages as messages,
  workChannels as channels,
} from "@pubnub/sample-chat-data";

export interface PubNubMockOptions {
  uuid?: string;
  returnedUuid?: string;
}

export function PubNubMock(options: PubNubMockOptions = {}): void {
  const uuid = options.uuid || "user_63ea15931d8541a3bd35e5b1f09087dc";
  const listeners: ListenerParameters = {};
  const actions: MessageActionEvent[] = [];

  this.addMessageAction = (obj: AddMessageActionParameters) => {
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
    listeners.messageAction && listeners.messageAction(action);
    return new Promise<{ data: MessageAction }>((resolve) => {
      resolve({ data: action.data });
    });
  };

  this.addListener = (obj: ListenerParameters) => {
    Object.assign(listeners, obj);
  };

  this.removeListener = (obj: ListenerParameters) => {
    Object.keys(obj).forEach((key) => delete listeners[key as keyof ListenerParameters]);
  };

  this.fetchMessages = async (args: FetchMessagesParameters) => {
    let messagesCopy = [...messages];
    if (args.start) {
      messagesCopy = messagesCopy.filter(
        (m) => parseInt(m.timetoken) < parseInt(args.start as string)
      );
    }
    messagesCopy = messagesCopy.slice(Math.max(messagesCopy.length - (args.count as number), 0));

    return new Promise<FetchMessagesResponse>((resolve) => {
      resolve({
        channels: {
          [args.channels[0]]: messagesCopy,
        },
      });
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  this.getFileUrl = ({ channel, id, name }) => {
    return `https://images.ctfassets.net/3prze68gbwl1/76L8lpo46Hu4WvNr9kJvkE/15bade65538769e12a12d95bff1df776/pubnub-logo-docs.svg`;
  };

  this.getUUID = () => options.returnedUuid || uuid;

  this.getSubscribedChannels = () => ["space.ce466f2e445c38976168ba78e46"];

  this.getSubscribedChannelGroups = () => [];

  this.hereNow = (options: HereNowParameters) => {
    return new Promise<HereNowResponse>((resolve) => {
      const channels = options.channels || [];

      resolve({
        totalChannels: channels.length,
        totalOccupancy: channels.length * users.length,
        channels: channels
          .map((channel) => ({
            name: channel,
            occupancy: users.length,
            occupants: users.map((u: { id: string }) => ({ uuid: u.id })),
          }))
          .reduce((obj, item) => ({ ...obj, [item["name"]]: item }), {}),
      });
    });
  };

  this.publish = (obj: PublishParameters) => {
    const message = {
      channel: obj.channel,
      actualChannel: obj.channel,
      subscribedChannel: obj.channel,
      message: obj.message,
      timetoken: Date.now() + "0000",
      publisher: uuid,
      subscription: "",
      uuid,
      actions: {},
    };
    messages.push(message);
    listeners.message && listeners.message(message);
    return new Promise<PublishResponse>((resolve) => {
      resolve({
        timetoken: parseInt(Date.now() + "0000"),
      });
    });
  };

  this.removeMessageAction = (obj: RemoveMessageActionParameters) => {
    const action = actions.find((a) => a.data.actionTimetoken === obj.actionTimetoken);
    if (!action) {
      return;
    }
    const index = actions.indexOf(action);
    actions.splice(index, 1);
    action.event = "removed";
    listeners.messageAction && listeners.messageAction(action);
    return new Promise<{ data: unknown }>((resolve) => {
      resolve({ data: {} });
    });
  };

  this.signal = (args: SignalParameters) => {
    listeners.signal &&
      listeners.signal({
        channel: args.channel,
        subscription: "",
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

  this.sendFile = (args: SendFileParameters) => {
    // TODO: generate file message

    return new Promise<SendFileResponse>((resolve) => {
      resolve({
        timetoken: Date.now() + "0000",
        id: "random-file-uuid",
        name: args.file.name,
      });
    });
  };

  this.objects = {
    getAllUUIDMetadata: (options: GetAllMetadataParameters) => {
      const limit = options.limit || users.length;
      const page = Number(options.page?.next) || 0;
      const offset = page * limit;

      return {
        data: users.slice(offset, offset + limit),
        totalCount: users.length,
        next: page + 1,
      };
    },
    getAllChannelMetadata: (options: GetAllMetadataParameters) => {
      const limit = options.limit || channels.length;
      const page = Number(options.page?.next) || 0;
      const offset = page * limit;

      return {
        data: channels.slice(offset, offset + limit),
        totalCount: channels.length,
        next: page + 1,
      };
    },
    getChannelMembers: (options: GetAllMetadataParameters) => {
      const limit = options.limit || users.length;
      const page = Number(options.page?.next) || 0;
      const offset = page * limit;

      return {
        data: users.slice(offset, offset + limit),
        totalCount: users.length,
        next: page + 1,
      };
    },
    getMemberships: (options: GetAllMetadataParameters) => {
      const limit = options.limit || channels.length;
      const page = Number(options.page?.next) || 0;
      const offset = page * limit;

      return {
        data: channels.slice(offset, offset + limit),
        totalCount: channels.length,
        next: page + 1,
      };
    },
    getUUIDMetadata: (args: GetUUIDMetadataParameters) => ({
      data: users.find((u: { id: string | undefined }) => u.id === args.uuid),
    }),
  };

  this.stop = () => true;
  this.subscribe = () => true;
  this.unsubscribe = () => true;
  this._config = {
    _addPnsdkSuffix: () => true,
  };
}
