import React, { useState } from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { Chat, MessageInput, MessageList } from "@pubnub/react-chat-components";

import { ReactComponent as ArrowUp } from "../assets/arrow-turn-up.svg";
import DoctorDetails from "../components/DoctorDetails";
import "./PatientView.scss";

type PatientViewProps = {
  patient: UUIDMetadataObject<ObjectCustom>;
  doctor: UUIDMetadataObject<ObjectCustom>;
  channel: string;
};

function PatientView(props: PatientViewProps): JSX.Element {
  const { patient, doctor, channel } = props;
  const [widgetOpen, setWidgetOpen] = useState(true);

  return (
    <main className="patient-view">
      <Chat currentChannel={channel} users={[patient, doctor]}>
        {widgetOpen && (
          <section>
            <header>
              <DoctorDetails doctor={doctor} big>
                <button onClick={() => setWidgetOpen(false)} />
              </DoctorDetails>
            </header>

            <article>
              <MessageList />
              <MessageInput sendButton={<ArrowUp />} />
            </article>
          </section>
        )}

        <button
          onClick={() => setWidgetOpen(!widgetOpen)}
          style={{ backgroundImage: `url(${patient.profileUrl})` }}
        />
      </Chat>
    </main>
  );
}

export default PatientView;
