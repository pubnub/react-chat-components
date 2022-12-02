import React, { useState } from "react";
import { UserEntity, MessageList, MessageInput, Chat } from "@pubnub/react-chat-components";
import { actionCompleted } from "pubnub-demo-integration";

import { ReactComponent as ArrowUpIcon } from "../assets/arrow-turn-up.svg";
import { ReactComponent as UnderlineIcon } from "../assets/underline.svg";
import memberships from "../data/memberships.json";
import jsonUsers from "../data/users.json";
const users = jsonUsers as Array<UserEntity & { type: string }>;

type PatientViewProps = {
  patient: UserEntity & { type: string };
};

function PatientView(props: PatientViewProps): JSX.Element {
  const { patient } = props;
  const membership = memberships.find((m) => m.members.includes(patient.id));
  const channel = membership?.channelId;
  const doctorId = membership?.members.find((id) => id !== patient.id);
  const doctor = users.find((u) => u.id === doctorId);
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [unread, setUnread] = useState(0);
  const onMessage = () => setUnread((c) => c + 1);
  if (!channel || !doctor) return <></>;

  return (
    <div
      className={`patient-view flex flex-col items-end justify-end overflow-hidden p-5 w-[440px] ${
        window.innerHeight < 750 ? "h-[680px]" : "h-[750px]"
      }`}
    >
      <header className="pb-2 mb-8 border-b border-solid border-gray-300 w-full">
        <h1 className="text-gray-400 font-bold">Patient&apos;s Interface</h1>
        <h2 className="text-gray-400">
          Logged in as: <strong>{patient.name}</strong>
        </h2>
      </header>

      <section
        className={`flex flex-col w-full rounded-xl shadow-xl overflow-hidden grow ${
          !widgetOpen && "invisible"
        }`}
      >
        <header className="px-4 h-[70px] bg-cyan-700 dark:bg-slate-700 text-white flex items-center shrink-0">
          {doctor.profileUrl && (
            <img
              alt={`${doctor.name}'s Avatar`}
              src={doctor.profileUrl}
              className="rounded-full w-9 h-9 mr-3"
            />
          )}

          <div className="grow">
            <p className="font-bold leading-5">{doctor.name}</p>
            <p className="leading-5">{doctor.custom?.title}</p>
          </div>

          <button
            onClick={() => setWidgetOpen(false)}
            className="w-11 h-11 rounded-full ease-in-out duration-300 hover:bg-cyan-600
                        dark:hover:bg-slate-500 active:bg-cyan-400 dark:active:bg-slate-300"
          >
            <UnderlineIcon className="inline" />
          </button>
        </header>

        <main className="flex flex-col overflow-hidden grow">
          <Chat currentChannel={channel} users={users} onMessage={onMessage}>
            <MessageList
              welcomeMessages={{
                message: {
                  id: "id-welcome-p",
                  type: "welcome",
                  text: "Please open another window or tab to chat",
                },
                timetoken: (new Date().getTime() * 10000).toString(),
              }}
            />
            <MessageInput
              sendButton={<ArrowUpIcon />}
              onSend={() => {
                actionCompleted({ action: "Send a Message as a Patient" });
              }}
            />
          </Chat>
        </main>
      </section>
      <button
        onClick={() => {
          setWidgetOpen(!widgetOpen);
          setUnread(0);
        }}
        style={{ backgroundImage: `url(${patient.profileUrl})` }}
        className={`border-[3px] duration-300 ease-in-out h-20 mt-8 relative rounded-full shadow-lg w-20
                    bg-contain border-solid dark:hover:border-slate-500 hover:border-cyan-500 shrink-0
                    ${widgetOpen ? "border-cyan-700 dark:border-slate-700" : "border-white"}
                  `}
      >
        {!widgetOpen && !!unread && (
          <span className="absolute bg-cyan-700 dark:bg-slate-500 flex font-bold h-8 items-center justify-center right-[-10px] rounded-full text-sm text-white top-[-10px] w-8">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}

export default PatientView;
