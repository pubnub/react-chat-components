import React from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { Chat, MemberList, MessageInput, MessageList } from "@pubnub/react-chat-components";
import DoctorDetails from "../doctor-details/doctor-details";
import medicalIconUrl from "../../assets/clipboard-medical.svg";
import ellipsisIconUrl from "../../assets/ellipsis-vertical.svg";
import arrowIconUrl from "../../assets/arrow-turn-up.svg";
import "./doctor-view.scss";
import { useState } from "react";

type DoctorViewProps = {
  patient: UUIDMetadataObject<ObjectCustom>;
  doctor: UUIDMetadataObject<ObjectCustom>;
  channel: string;
};

function DoctorView(props: DoctorViewProps): JSX.Element {
  const { patient, doctor, channel } = props;
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className={`doctor-view ${darkMode ? "dark" : ""}`}>
      <Chat currentChannel={channel} users={[patient, doctor]}>
        <aside>
          <header>
            <img src={medicalIconUrl} alt="Medical Clipboard Icon" />
            <span>Patient Queue</span>
          </header>

          <nav>
            <MemberList members={[patient]} />
          </nav>

          <footer>
            <DoctorDetails doctor={doctor}>
              <button
                style={{ backgroundImage: `url(${ellipsisIconUrl})` }}
                onClick={() => setDarkMode(!darkMode)}
              />
            </DoctorDetails>
          </footer>
        </aside>

        <section>
          <header>
            <strong>{patient.name}</strong>
          </header>

          <article>
            <MessageList />
            <MessageInput sendButton={<img src={arrowIconUrl} />} />
          </article>
        </section>
      </Chat>
    </main>
  );
}

export default DoctorView;
