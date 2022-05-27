import React from "react";
import {
  UserEntity,
  MessageList,
  MessageInput,
  MemberList,
  Chat,
} from "@pubnub/react-chat-components";

import { ReactComponent as MedicalIcon } from "../assets/clipboard-medical.svg";
import { ReactComponent as ArrowUp } from "../assets/arrow-turn-up.svg";

type DoctorViewProps = {
  patient: UserEntity;
  doctor: UserEntity;
  channel: string;
};

function DoctorView(props: DoctorViewProps): JSX.Element {
  const { patient, doctor, channel } = props;

  return (
    <div className="p-5 grow overflow-hidden">
      <div className="flex justify-end overflow-hidden h-full rounded-xl shadow-xl">
        <Chat currentChannel={channel} users={[patient, doctor]}>
          <aside className="flex flex-col">
            <header className="flex items-center h-[70px] pl-4 text-white bg-cyan-700 dark:bg-slate-700 tracking-[2px] uppercase">
              <MedicalIcon className="ml-2 mr-5" />
              <span>Patient Queue</span>
            </header>

            <nav className="bg-gray-100 dark:bg-gray-700 flex flex-col grow w-64">
              <MemberList members={[patient]} />
            </nav>

            <footer className="bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-white text-sm px-3 h-[58px] flex items-center">
              {doctor.profileUrl && (
                <img
                  src={doctor.profileUrl}
                  className="rounded-full w-9 h-9 mr-3"
                  alt={`${doctor.name}'s Avatar`}
                />
              )}
              <p>{doctor.name}</p>
            </footer>
          </aside>

          <section className="flex flex-col grow">
            <header className="flex items-center h-[70px] pl-4 bg-cyan-500 dark:bg-slate-500 dark:text-white text-gray-800 shrink-0">
              <strong>{patient.name}</strong>
            </header>

            <article className="flex flex-col grow overflow-hidden">
              <MessageList />
              <MessageInput sendButton={<ArrowUp />} />
            </article>
          </section>
        </Chat>
      </div>
    </div>
  );
}

export default DoctorView;
