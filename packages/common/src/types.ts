import {
  UUIDMetadataObject,
  ChannelMetadataObject,
  ObjectCustom,
  FetchMessagesResponse,
} from "pubnub";

export type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export type ChannelEntity = ChannelMetadataObject<ObjectCustom>;

export type UserEntity = UUIDMetadataObject<ObjectCustom>;

export type ChannelEntityWithMembership = ChannelEntity & {
  membership?: ObjectCustom;
};

export type UserEntityWithMembership = UserEntity & {
  membership?: ObjectCustom;
};

export interface MessageEnvelope {
  channel?: string;
  message: MessagePayload | FilePayload;
  timetoken: string | number;
  messageType?: string | number;
  publisher?: string;
  uuid?: string;
  meta?: {
    [key: string]: unknown;
  };
  actions?: {
    [type: string]: {
      [value: string]: Array<{
        uuid: string;
        actionTimetoken: string | number;
      }>;
    };
  };
}

export interface MessagePayload {
  id: string;
  type?: string;
  text?: string;
  sender?: UUIDMetadataObject<ObjectCustom>;
  attachments?: Array<ImageAttachment | LinkAttachment>;
  createdAt?: string;
  [key: string]: unknown;
}

export interface FilePayload {
  message?: MessagePayload;
  file: FileAttachment;
}

export interface FileAttachment {
  id: string;
  name: string;
  url?: string;
}

export interface ImageAttachment {
  type: "image";
  image: {
    source: string;
  };
}

export interface LinkAttachment {
  type: "link";
  description?: string;
  title?: string;
  icon?: {
    source: string;
  };
  image: {
    source: string;
  };
  provider?: {
    name: string;
    url: string;
  };
}

export interface RetryOptions {
  maxRetries: number;
  timeout: number;
  exponentialFactor: number;
}

export interface ProperFetchMessagesResponse extends FetchMessagesResponse {
  error: boolean;
  error_message: string;
  status: number;
  more?: {
    max: number;
    start: string;
    url: string;
  };
}
