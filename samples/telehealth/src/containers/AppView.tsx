import React, { useState } from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { users } from "@pubnub/react-chat-data";

import { ReactComponent as MoonOverSun } from "../assets/moon-over-sun.svg";
import { ReactComponent as MoonStars } from "../assets/moon-stars.svg";
import PatientView from "./PatientView";
import DoctorView from "./DoctorView";
import "./AppView.scss";

const patients = users.slice(0, 10);
const doctors = users.slice(10, 20);
const randomPatient = patients[Math.floor(Math.random() * patients.length)];
const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
const channel = `telehealth-${randomDoctor.id}-${randomPatient.id}`;
randomPatient.custom.title = "Patient ID: 987655454";
randomDoctor.name = "Dr " + randomDoctor.name;

const patientClient = new PubNub({
  publishKey: import.meta.env.REACT_APP_PUB_KEY as string,
  subscribeKey: import.meta.env.REACT_APP_SUB_KEY as string,
  uuid: randomPatient.id,
});

const doctorClient = new PubNub({
  publishKey: import.meta.env.REACT_APP_PUB_KEY as string,
  subscribeKey: import.meta.env.REACT_APP_SUB_KEY as string,
  uuid: randomDoctor.id,
});

function AppView(): JSX.Element {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className={`app-view ${darkMode ? "dark" : "light"}`}>
      <PubNubProvider client={patientClient}>
        <PatientView patient={randomPatient} doctor={randomDoctor} channel={channel} />
      </PubNubProvider>

      <PubNubProvider client={doctorClient}>
        <DoctorView patient={randomPatient} doctor={randomDoctor} channel={channel} />
      </PubNubProvider>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <MoonOverSun /> : <MoonStars />}
        Switch to {darkMode ? "Light" : "Dark"} Theme
      </button>
    </main>
  );
}

export default AppView;
