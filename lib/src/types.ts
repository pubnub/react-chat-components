import Pubnub, {
  ChannelMetadata,
  ChannelMetadataObject,
  GetAllMetadataParameters,
  ObjectCustom,
  UUIDMetadata,
  UUIDMetadataObject,
} from "pubnub";

export type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export interface EmojiPickerElementProps {
  onSelect?: ({ native: string }) => void;
}

export interface FetchUserParameters {
  userId?: string | undefined;
  include?:
    | {
        customFields?: boolean | undefined;
      }
    | undefined;
}

export interface CreateSpaceParameters {
  spaceId: string;
  data: ChannelMetadata<ObjectCustom>;
  include?:
    | {
        customFields?: boolean | undefined;
      }
    | undefined;
}

export interface CreateUserParameters {
  userId?: string | undefined;
  data: UUIDMetadata<ObjectCustom>;
  include?:
    | {
        customFields?: boolean | undefined;
      }
    | undefined;
}

interface FetchMembershipsParametersBase {
  filter?: string | undefined;
  sort?: Record<string, unknown> | undefined;
  limit?: number | undefined;
  page?:
    | {
        next?: string | undefined;
        prev?: string | undefined;
      }
    | undefined;
}

export interface FetchMembershipsFromSpaceParameters extends FetchMembershipsParametersBase {
  spaceId?: string;
  readonly userId?: undefined;
  include?:
    | {
        totalCount?: boolean | undefined;
        customFields?: boolean | undefined;
        userFields?: boolean | undefined;
        customUserFields?: boolean | undefined;
      }
    | undefined;
}

export interface FetchMembershipsFromUserParameters extends FetchMembershipsParametersBase {
  userId?: string;
  readonly spaceId?: undefined;
  include?:
    | {
        totalCount?: boolean | undefined;
        customFields?: boolean | undefined;
        spaceFields?: boolean | undefined;
        customSpaceFields?: boolean | undefined;
      }
    | undefined;
}

export interface PagedObjectsResponse<DataType> {
  status: number;
  data: DataType;
  prev?: string | undefined;
  next?: string | undefined;
  totalCount?: number | undefined;
}

export interface MembershipObject {
  eTag: string;
  updated: string;
  custom: ObjectCustom;
}

export interface UserMembershipObject extends MembershipObject {
  user: UserEntity;
}

export interface SpaceMembershipObject extends MembershipObject {
  space: ChannelEntity;
}

export interface VSPPubnub extends Pubnub {
  fetchUser: (options: FetchUserParameters) => Pubnub.GetUUIDMetadataResponse<ObjectCustom>;
  fetchUsers: (
    options: GetAllMetadataParameters
  ) => Pubnub.GetAllUUIDMetadataResponse<ObjectCustom>;
  fetchSpaces: (
    options: GetAllMetadataParameters
  ) => Pubnub.GetAllChannelMetadataResponse<ObjectCustom>;
  createSpace: (options: CreateSpaceParameters) => Pubnub.SetChannelMetadataResponse<ObjectCustom>;
  createUser: (options: CreateUserParameters) => Pubnub.SetUUIDMetadataResponse<ObjectCustom>;
  fetchMemberships: (
    options: FetchMembershipsFromSpaceParameters | FetchMembershipsFromUserParameters
  ) => PagedObjectsResponse<SpaceMembershipObject[] | UserMembershipObject[]>;
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
