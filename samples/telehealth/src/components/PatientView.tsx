import React, { useState } from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { Chat, MessageInput, MessageList } from "@pubnub/react-chat-components";

import { ReactComponent as ArrowUpIcon } from "../assets/arrow-turn-up.svg";
import { ReactComponent as UnderlineIcon } from "../assets/underline.svg";

type PatientViewProps = {
  patient: UUIDMetadataObject<ObjectCustom>;
  doctor: UUIDMetadataObject<ObjectCustom>;
  channel: string;
};

function PatientView(props: PatientViewProps): JSX.Element {
  const { patient, doctor, channel } = props;
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [unread, setUnread] = useState(0);
  const onMessage = () => setUnread((c) => c + 1);

  return (
    <div className="patient-view flex flex-col items-end justify-end grow overflow-hidden p-5">
      <section
        className={`flex flex-col w-full rounded-xl shadow-xl overflow-hidden grow ${
          !widgetOpen && "hidden"
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
            <p className="leading-5">General Practitioner</p>
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
          <Chat currentChannel={channel} users={[patient, doctor]} onMessage={onMessage}>
            <MessageList />
            <MessageInput sendButton={<ArrowUpIcon />} />
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
