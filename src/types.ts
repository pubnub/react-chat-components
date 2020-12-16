export type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export interface Channel {
  id: string;
  name: string;
  description?: string;
  custom?: {
    [id: string]: unknown;
  };
}

export interface Message {
  channel?: string;
  message: {
    type: string;
    text: string;
    attachments?: Array<ImageAttachment | LinkAttachment>;
    [key: string]: unknown;
  };
  timetoken: string | number;
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

export interface ImageAttachment {
  type: "image";
  image: {
    source: string;
  };
}

export interface LinkAttachment {
  type: "link";
  description: string;
  title: string;
  icon: {
    source: string;
  };
  image: {
    source: string;
  };
  provider: {
    name: string;
    url: string;
  };
}
