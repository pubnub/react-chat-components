import React from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { Chat, MemberList, MessageInput, MessageList } from "@pubnub/react-chat-components";

import { ReactComponent as MedicalIcon } from "../assets/clipboard-medical.svg";
import { ReactComponent as ArrowUp } from "../assets/arrow-turn-up.svg";
import DoctorDetails from "../components/DoctorDetails";
import "./DoctorView.scss";

type DoctorViewProps = {
  patient: UUIDMetadataObject<ObjectCustom>;
  doctor: UUIDMetadataObject<ObjectCustom>;
  channel: string;
};

function DoctorView(props: DoctorViewProps): JSX.Element {
  const { patient, doctor, channel } = props;

  return (
    <main className="doctor-view">
      <Chat currentChannel={channel} users={[patient, doctor]}>
        <aside>
          <header>
            <MedicalIcon />
            <span>Patient Queue</span>
          </header>

          <nav>
            <MemberList members={[patient]} />
          </nav>

          <footer>
            <DoctorDetails doctor={doctor} />
          </footer>
        </aside>

        <section>
          <header>
            <strong>{patient.name}</strong>
          </header>

          <article>
            <MessageList />
            <MessageInput sendButton={<ArrowUp />} />
          </article>
        </section>
      </Chat>
    </main>
  );
}

export default DoctorView;
