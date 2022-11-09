import React, { useState } from "react";
import { usePubNub } from "pubnub-react";
import { MessageEnvelope, UserEntity } from "@pubnub/react-chat-components";

interface ReportUserModalProps {
  currentUser: UserEntity;
  reportedMessage?: MessageEnvelope;
  hideModal: () => void;
  users: UserEntity[];
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
}: ReportUserModalProps): JSX.Element => {
  const pubnub = usePubNub();
  const [reported, setReported] = useState(false);
  const uuid = reportedMessage?.uuid || reportedMessage?.publisher || "";

  const reasons = [
    {
      icon: "delete",
      text: "It's a spam",
    },
    {
      icon: "visibility_off",
      text: "Nudity or sexual activity",
    },
    {
      icon: "healing",
      text: "Hate speech or symbols",
    },
    {
      icon: "thumb_down",
      text: "Violence or dangerous organizations",
    },
    {
      icon: "production_quantity_limits",
      text: "Sales or illegal or regulated goods",
    },
    {
      icon: "mood_bad",
      text: "Bullying or harassment",
    },
    {
      icon: "copyright",
      text: "Intellectual property violation",
    },
    {
      icon: "feedback",
      text: "False information",
    },
  ];

  const reportUser = async (reason: string) => {
    if (!reportedMessage) return;
    setReported(true);
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
  };

  return (
    <div className="overlay">
      <div className="modal report-user-modal">
        <div className="header">
          <strong>{reported ? "Thank you for letting us know" : "Report user"}</strong>
          <button
            className="material-icons-outlined"
            onClick={() => {
              hideModal();
              setReported(false);
            }}
          >
            close
          </button>
        </div>

        {reported ? (
          <div className="center">
            <i className="material-icons-outlined">check_circle</i>
            <p>Your feedback is important in helping us keep the community safe.</p>
            <button
              onClick={() => {
                hideModal();
                setReported(false);
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2>Why are you reporting this comment?</h2>
            {reasons.map((reason) => (
              <button
                className="report-button"
                onClick={() => reportUser(reason.text)}
                key={reason.icon}
              >
                <i className="material-icons-outlined">{reason.icon}</i>
                <span>{reason.text}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
