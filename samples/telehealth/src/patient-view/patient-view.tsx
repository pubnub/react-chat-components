import React, { useState } from "react";
import { UUIDMetadataObject, ObjectCustom } from "pubnub";
import { Chat, MessageInput, MessageList } from "@pubnub/react-chat-components";
import DoctorDetails from "../doctor-details/doctor-details";
import arrowIconUrl from "../../assets/arrow-turn-up.svg";
import "./patient-view.scss";

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
              <MessageInput sendButton={<img src={arrowIconUrl} />} />
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
