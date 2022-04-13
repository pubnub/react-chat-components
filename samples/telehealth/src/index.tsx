import React from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import PatientView from "./patient-view/patient-view";
import DoctorView from "./doctor-view/doctor-view";
import users from "../../../data/users.json";
import "./index.css";

const randomPatient = users[Math.floor(Math.random() * users.length)];
const randomDoctor = users[Math.floor(Math.random() * users.length)];
const channel = `telehealth-${randomDoctor.id}-${randomPatient.id}`;
randomPatient.custom.title = "Patient ID: 987655454";
randomDoctor.name = "Dr " + randomDoctor.name;

const patientClient = new PubNub({
  publishKey: import.meta.env.REACT_APP_PUB_KEY,
  subscribeKey: import.meta.env.REACT_APP_SUB_KEY,
  uuid: randomPatient.id,
});

const doctorClient = new PubNub({
  publishKey: import.meta.env.REACT_APP_PUB_KEY,
  subscribeKey: import.meta.env.REACT_APP_SUB_KEY,
  uuid: randomDoctor.id,
});

ReactDOM.render(
  <React.StrictMode>
    <div className="app">
      <PubNubProvider client={patientClient}>
        <PatientView patient={randomPatient} doctor={randomDoctor} channel={channel} />
      </PubNubProvider>

      <PubNubProvider client={doctorClient}>
        <DoctorView patient={randomPatient} doctor={randomDoctor} channel={channel} />
      </PubNubProvider>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
