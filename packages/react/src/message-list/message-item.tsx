import React from "react";
import { isEqual } from "lodash";
import type { useMessageListCore } from "@pubnub/common-chat-components";
import type { MessageListProps } from "./message-list";
import {
  isFilePayload,
  MessageEnvelope,
  getNameInitials,
  getPredefinedColor,
} from "@pubnub/common-chat-components";
import EmojiIcon from "../icons/emoji.svg";
import DownloadIcon from "../icons/download.svg";

export type ItemProps = Pick<
  ReturnType<typeof useMessageListCore>,
  | "addReaction"
  | "emojiPickerShown"
  | "getTime"
  | "getUser"
  | "isOwnMessage"
  | "pubnub"
  | "reactingToMessage"
  | "removeReaction"
  | "scrolledBottom"
  | "setEmojiPickerShown"
  | "users"
> & {
  envelope: MessageEnvelope;
  handleOpenReactions: (e: React.MouseEvent, tt) => void;
  listProps: Pick<
    MessageListProps,
    | "bubbleRenderer"
    | "enableReactions"
    | "extraActionsRenderer"
    | "fileRenderer"
    | "filter"
    | "messageRenderer"
    | "reactionsPicker"
  >;
  scrollToBottom: () => void;
};

export const MessageListItem = React.memo(Item, (prev, next) => {
  if (prev.envelope.timetoken !== next.envelope.timetoken) return false;
  if (!isEqual(prev.envelope.actions, next.envelope.actions)) return false;
  return true;
});

function Item({
  addReaction,
  emojiPickerShown,
  envelope,
  getTime,
  getUser,
  handleOpenReactions,
  isOwnMessage,
  listProps,
  pubnub,
  reactingToMessage,
  removeReaction,
  scrollToBottom,
  scrolledBottom,
  setEmojiPickerShown,
  users,
}: ItemProps) {
  const {
    bubbleRenderer,
    enableReactions,
    extraActionsRenderer,
    fileRenderer,
    filter,
    messageRenderer,
    reactionsPicker,
  } = listProps;

  const actions = envelope.actions;
  const deleted = !!Object.keys(actions?.deleted || {}).length;
  if (deleted) return;
  const uuid = envelope.uuid || envelope.publisher || "";
  const currentUserClass = isOwnMessage(uuid) ? "pn-msg--own" : "";
  const message = isFilePayload(envelope.message) ? envelope.message.message : envelope.message;
  const time = getTime(envelope.timetoken as number);
  const isOwn = isOwnMessage(uuid);
  const user = message?.sender || getUser(uuid);
  const file = isFilePayload(envelope.message) && envelope.message.file;
  const editedText = (Object.entries(actions?.updated || {}).pop() || []).shift() as string;
  const reactions = envelope.actions?.reaction;

  return (
    <div className={`pn-msg ${currentUserClass}`} key={envelope.timetoken}>
      {messageRenderer && (filter ? filter(envelope) : true) ? (
        messageRenderer({ message: envelope, user, time, isOwn, editedText })
      ) : (
        <>
          <div className="pn-msg__avatar" style={{ backgroundColor: getPredefinedColor(uuid) }}>
            {user?.profileUrl ? (
              <img src={user.profileUrl} alt="User avatar" />
            ) : (
              getNameInitials(user?.name || uuid)
            )}
          </div>

          <div className="pn-msg__main">
            <div className="pn-msg__content">
              <div className="pn-msg__title">
                <span className="pn-msg__author">{user?.name || uuid}</span>
                <span className="pn-msg__time">{time}</span>
              </div>
              {message?.text &&
                (bubbleRenderer && (filter ? filter(envelope) : true) ? (
                  bubbleRenderer({ message: envelope, user, time, isOwn, editedText })
                ) : (
                  <div className="pn-msg__bubble">{editedText || message?.text}</div>
                ))}
            </div>

            <div className="pn-msg__extras">
              {file && file.name ? (
                fileRenderer ? (
                  fileRenderer(file)
                ) : (
                  <div className="pn-msg__file">
                    {/\.(svg|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name) ? (
                      <img
                        alt={file.name}
                        className="pn-msg__image"
                        src={file.url}
                        onLoad={() => {
                          if (scrolledBottom) scrollToBottom();
                        }}
                      />
                    ) : (
                      <div className="pn-msg__bubble">
                        <a
                          className="pn-msg__nonImage"
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          {file.name}
                          <DownloadIcon className="pn-msg__downloadIcon" />
                        </a>
                      </div>
                    )}
                  </div>
                )
              ) : null}

              {enableReactions && reactions ? (
                <div className="pn-msg__reactions">
                  {Object.entries(reactions)
                    .sort(([, a], [, b]) => b.length - a.length)
                    .map(([reaction, instances]) => {
                      const instancesLimit = 99;
                      const instancesLimited = instances.slice(0, instancesLimit);
                      const instancesOverLimit = instances.length - instancesLimited.length;
                      const userReaction = instances?.find((i) => i.uuid === pubnub.getUUID());
                      const userNames = instancesLimited.map((i) => {
                        const user = users.find((u) => u.id === i.uuid);
                        return user ? user.name : i.uuid;
                      });
                      const tooltipContent = `
                  ${userNames.join(", ")}
                  ${instancesOverLimit ? `and ${instancesOverLimit} more` : ``}
                `;

                      return (
                        <div
                          className={`pn-tooltip pn-msg__reaction ${
                            userReaction ? "pn-msg__reaction--active" : ""
                          }`}
                          key={reaction}
                          data-tooltip={tooltipContent}
                          onClick={() => {
                            userReaction
                              ? removeReaction(
                                  reaction,
                                  envelope.timetoken,
                                  userReaction.actionTimetoken
                                )
                              : addReaction(reaction, envelope.timetoken);
                          }}
                        >
                          {reaction} {instancesLimited.length}
                          {instancesOverLimit ? "+" : ""}
                        </div>
                      );
                    })}
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}

      <div className="pn-msg__actions">
        {extraActionsRenderer && extraActionsRenderer(envelope)}
        {reactionsPicker && message?.type !== "welcome" ? (
          <div
            className="pn-msg__reactions-toggle"
            title="Add a reaction"
            onClick={(e) => {
              emojiPickerShown && reactingToMessage === envelope.timetoken
                ? setEmojiPickerShown(false)
                : handleOpenReactions(e, envelope.timetoken);
            }}
          >
            <EmojiIcon />
          </div>
        ) : null}
      </div>
    </div>
  );
}
