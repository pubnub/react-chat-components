import { UUIDMetadataObject, ObjectCustom } from "pubnub";

export type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export interface EmojiPickerElementProps {
  onSelect?: ({ native: string }) => void;
}

export interface Message {
  channel?: string;
  message: {
    type?: string;
    text?: string;
    sender?: UUIDMetadataObject<ObjectCustom>;
    attachments?: Array<ImageAttachment | LinkAttachment>;
    file?: FileAttachment;
    [key: string]: unknown;
  };
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
