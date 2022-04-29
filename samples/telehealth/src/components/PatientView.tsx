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

  return (
    <div className="patient-view flex flex-col grow items-end justify-end">
      {widgetOpen && (
        <section className="flex flex-col grow overflow-hidden w-full rounded-xl shadow-xl">
          <header className="px-4 h-[70px] bg-cyan-700 dark:bg-slate-700 text-white flex items-center">
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

          <main className="flex flex-col grow overflow-hidden">
            <Chat currentChannel={channel} users={[patient, doctor]}>
              <MessageList />
              <MessageInput sendButton={<ArrowUpIcon />} />
            </Chat>
          </main>
        </section>
      )}

      <button
        onClick={() => setWidgetOpen(!widgetOpen)}
        style={{ backgroundImage: `url(${patient.profileUrl})` }}
        className={`w-20 h-20 shadow-lg rounded-full mt-8 border-[3px] ease-in-out duration-300
                    border-solid hover:border-cyan-500 dark:hover:border-slate-500 bg-contain
                    ${widgetOpen ? "border-cyan-700 dark:border-slate-700" : "border-white"}
                  `}
      />
    </div>
  );
}

export default PatientView;
