import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { MemberList } from "@pubnub/react-chat-components";
import { UUIDMetadataObject, ChannelMetadataObject, ObjectCustom } from "pubnub";
import {
  XIcon,
  SearchIcon,
  PeopleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
} from "@primer/octicons-react";

type UserType = UUIDMetadataObject<ObjectCustom>;
type ChannelType = ChannelMetadataObject<ObjectCustom>;

interface CreateChatModalProps {
  users: UserType[];
  currentUser: UserType;
  setCurrentChannel: (channel: Pick<ChannelType, "id" | "name" | "description">) => void;
  hideModal: () => void;
}

/**
 * This modal is opened after clicking the "plus" icon next to the Direct chats header
 * It is used to create new private chats between selected users
 * It creates two kind of channels, direct_ and group_, depending on how many users were selected
 */
export const CreateChatModal = ({
  users,
  currentUser,
  setCurrentChannel,
  hideModal,
}: CreateChatModalProps) => {
  const pubnub = usePubNub();
  const uuid = pubnub.getUUID();
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [usersFilter, setUsersFilter] = useState("");
  const [channelName, setChannelName] = useState("");

  const handleCheck = (member: UserType) => {
    setSelectedUsers((users) => {
      return users.find((m) => m.id === member.id)
        ? users.filter((m) => m.id !== member.id)
        : [...users, member];
    });
  };

  const createDirectChat = async (user: UserType) => {
    if (creatingChannel) return;
    setCreatingChannel(true);
    const uuids = [uuid, user.id].sort();
    const channel = `direct_${uuids.join("@")}`;
    const data = {
      name: user.name,
      custom: {
        thumb: user.profileUrl,
      },
    };
    await pubnub.objects.setChannelMembers({ channel, uuids });
    setCurrentChannel({ id: channel, ...data });
    hideModal();
    setCreatingChannel(false);
  };

  const createGroupChat = async () => {
    if (creatingChannel) return;
    setCreatingChannel(true);
    const users = [currentUser, ...selectedUsers];
    const uuids = users.map((m) => m.id).sort();
    const randomHex = [...Array(27)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    const channel = `group_${randomHex}`;
    const name =
      channelName ||
      users
        .map((m) => m.name?.split(" ")[0])
        .sort()
        .join(", ");
    const data = {
      name,
      custom: {
        thumb: `https://www.gravatar.com/avatar/${randomHex}?s=256&d=identicon`,
      },
    };
    await pubnub.objects.setChannelMetadata({ channel, data });
    await pubnub.objects.setChannelMembers({ channel, uuids });
    setCurrentChannel({ id: channel, ...data });
    hideModal();
    setCreatingChannel(false);
  };

  return (
    <div className="overlay">
      <div className="modal create-chat-modal">
        <div className="header">
          {showGroups && (
            <span className="back-icon" onClick={() => setShowGroups(false)}>
              <ChevronLeftIcon size="medium" />
            </span>
          )}
          <span className="close-icon" onClick={() => hideModal()}>
            <XIcon />
          </span>
          <h4>New chat</h4>
        </div>
        <div className="filter-input">
          <input
            onChange={(e) => setUsersFilter(e.target.value)}
            placeholder="Search in users"
            type="text"
            value={usersFilter}
          />
          <SearchIcon />
        </div>
        {showGroups ? (
          <div className="form">
            <input
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Group chat name (optional)"
              type="text"
              value={channelName}
            />
          </div>
        ) : (
          <div className="group-button" onClick={() => setShowGroups(true)}>
            <PeopleIcon className="people-icon" />
            <strong>New group chat</strong>
            <ChevronRightIcon />
          </div>
        )}
        <MemberList
          members={users.filter((u) => u.name?.toLowerCase().includes(usersFilter))}
          onMemberClicked={(user) => createDirectChat(user)}
          memberRenderer={
            showGroups
              ? (user) => SelectableUserRenderer({ user, selectedUsers, handleCheck })
              : undefined
          }
        />
        {!!selectedUsers.length && (
          <div className="footer">
            <button disabled={creatingChannel} onClick={createGroupChat}>
              Create group chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * This custom renderer is passed into the Chat Components' MemberList
 * It is used to inject checked/unchecked icon into each member on the list
 * It uses most of the same classes as Components to look the same way apart of the icon
 */
const SelectableUserRenderer = ({ user, selectedUsers, handleCheck }: any) => {
  const userSelected = selectedUsers.find((m: UserType) => m.id === user.id);
  return (
    <div key={user.id} className="pn-member" onClick={() => handleCheck(user)}>
      <div className="pn-member__avatar">
        {user.profileUrl && <img src={user.profileUrl} alt="User avatar" />}
        {!user.profileUrl && <div className="pn-member__avatar-placeholder" />}
      </div>
      <div className="pn-member__main">
        <p className="pn-member__name">{user.name}</p>
        <p className="pn-member__title">{user.custom?.title}</p>
      </div>
      <div className={`check-icon ${userSelected && "checked"}`}>
        {userSelected && <CheckIcon verticalAlign="unset" />}
      </div>
    </div>
  );
};
