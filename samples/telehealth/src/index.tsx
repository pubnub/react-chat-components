import React from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import PatientView from "./patient-view/patient-view";
import DoctorView from "./doctor-view/doctor-view";
import users from "../../../data/users.json";
import "./index.css";

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
