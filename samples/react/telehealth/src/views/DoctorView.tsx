import React, { useState } from "react";
import {
  UserEntity,
  MessageList,
  MessageInput,
  ChannelList,
  Chat,
  ChannelEntity,
} from "@pubnub/react-chat-components";
import { actionCompleted } from "pubnub-demo-integration";

import { ReactComponent as MedicalIcon } from "../assets/clipboard-medical.svg";
import { ReactComponent as ArrowUp } from "../assets/arrow-turn-up.svg";
import memberships from "../data/memberships.json";
import users from "../data/users.json";

type DoctorViewProps = {
  doctor: UserEntity;
};

function DoctorView(props: DoctorViewProps): JSX.Element {
  const { doctor } = props;
  const doctorMemberships = memberships.filter((m) => m.members.includes(doctor.id));
  const channels = doctorMemberships.reduce((acc: ChannelEntity[], m) => {
    const patientId = m.members.find((id) => id !== doctor.id);
    const patient = users.find((u) => u.id === patientId);
    if (!patient) return acc;
    return [
      ...acc,
      {
        id: m.channelId,
        name: patient.name,
        description: `Patient ID: ${patient.id}`,
        custom: {
          profileUrl: patient?.profileUrl,
        },
        updated: "",
        eTag: "",
      },
    ];
  }, []);
  const [currentChannel, setCurrentChannel] = useState(channels[1] || { id: "default" });

  return (
    <div
      className={`p-5 overflow-hidden w-[740px] flex flex-col ${
        window.innerHeight < 750 ? "h-[650px]" : "h-[750px]"
      }`}
    >
      <header className="pb-2 mb-8 border-b border-solid border-gray-300">
        <h1 className="text-gray-400 font-bold">Doctor&apos;s Interface</h1>
        <h2 className="text-gray-400">
          Logged in as: <strong>{doctor.name}</strong>
        </h2>
      </header>

      <div className="flex justify-end overflow-hidden grow rounded-xl shadow-xl">
        <Chat currentChannel={currentChannel.id} users={users as UserEntity[]}>
          <aside className="flex flex-col">
            <header className="flex items-center h-[70px] pl-4 text-white bg-cyan-700 dark:bg-slate-700 tracking-[2px] uppercase">
              <MedicalIcon className="ml-2 mr-5" />
              <span>Patient Queue</span>
            </header>

            <nav className="bg-gray-100 dark:bg-gray-700 flex flex-col grow w-64">
              <ChannelList channels={channels} onChannelSwitched={(ch) => setCurrentChannel(ch)} />
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
              <strong>{currentChannel.name}</strong>
            </header>

            <article className="flex flex-col grow overflow-hidden">
              <MessageList
                welcomeMessages={{
                  message: {
                    id: "id-welcome-d",
                    type: "welcome",
                    text: "Please open another window or tab to chat",
                  },
                  timetoken: (new Date().getTime() * 10000).toString(),
                }}
              />
              <MessageInput
                sendButton={<ArrowUp />}
                onSend={() => {
                  actionCompleted({ action: "Send a Message as a Doctor" });
                }}
              />
            </article>
          </section>
        </Chat>
      </div>
    </div>
  );
}

export default DoctorView;
