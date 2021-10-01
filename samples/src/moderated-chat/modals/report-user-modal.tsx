import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { MessageEnvelope } from "@pubnub/react-chat-components";
import { XIcon } from "@primer/octicons-react";

type UserType = UUIDMetadataObject<ObjectCustom>;

interface ReportUserModalProps {
  currentUser: UserType;
  reportedMessage?: MessageEnvelope;
  hideModal: () => void;
  users: UserType[];
}

/**
 * This modal is opened after clicking the "report" icon that is shown when hovering over a message
 * It is used to report users, which can be later viewed in the Moderation Dashboard
 */
export const ReportUserModal = ({
  currentUser,
  reportedMessage,
  hideModal,
  users,
}: ReportUserModalProps) => {
  const pubnub = usePubNub();
  const [reason, setReason] = useState("");
  const [fetching, setFetching] = useState(false);
  const uuid = reportedMessage?.uuid || reportedMessage?.publisher || "";
  const user = users.find((u: UserType) => u.id === uuid);

  const reportUser = async () => {
    if (!reportedMessage) return;
    setFetching(true);
    const fullUserData = await pubnub.objects.getUUIDMetadata({
      uuid,
      include: { customFields: true },
    });
    const existingMetadata = fullUserData.data.custom;
    await pubnub.objects.setUUIDMetadata({
      uuid,
      data: {
        custom: {
          ...existingMetadata,
          flag: true,
          flaggedAt: Date.now(),
          flaggedBy: `${currentUser.name} (${currentUser.id})`,
          reason,
        },
      },
    });
    hideModal();
    setFetching(false);
  };

  return (
    <div className="overlay">
      <div className="modal report-user-modal">
        <div className="header">
          <span
            className="close-icon"
            onClick={() => {
              hideModal();
              setReason("");
            }}
          >
            <XIcon />
          </span>
          <h4>Report user</h4>
        </div>

        <div className="content">
          <div className="user-info">
            {user && user.profileUrl && <img src={user.profileUrl} alt="User avatar" />}
            <h4>{user?.name}</h4>
          </div>

          <div className="form">
            <input
              type="text"
              placeholder="Describe the report reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button disabled={fetching} onClick={() => reportUser()}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
