import { UUIDMetadataObject, ChannelMetadataObject, ObjectCustom } from "pubnub";

export type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export interface EmojiPickerElementProps {
  onSelect?: ({ native: string }) => void;
}

interface VSPEntity {
  type?: string;
  status?: string;
}

export type ChannelEntity = ChannelMetadataObject<ObjectCustom> & VSPEntity;

export type UserEntity = UUIDMetadataObject<ObjectCustom> & VSPEntity;

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

export function isFilePayload(message: MessagePayload | FilePayload): message is FilePayload {
  return (message as FilePayload).file !== undefined;
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
