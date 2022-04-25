import React, { useState } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { users } from "@pubnub/react-chat-data";

import { ReactComponent as MoonOverSun } from "./assets/moon-over-sun.svg";
import { ReactComponent as MoonStars } from "./assets/moon-stars.svg";
import PatientView from "./components/PatientView";
import DoctorView from "./components/DoctorView";
import "./index.css";

const patients = users.slice(0, 10);
const doctors = users.slice(10, 20);
const randomPatient = patients[Math.floor(Math.random() * patients.length)];
const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
const channel = `telehealth-${randomDoctor.id}-${randomPatient.id}`;
randomPatient.custom.title = `Patient ID: ${randomPatient.id.slice(10, 18)}`;
randomDoctor.name = "Dr " + randomDoctor.name;
randomDoctor.profileUrl = `/doctor-${~~(Math.random() * 21) + 1}.png`;

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
    <main
      className={`app-view ${darkMode ? "dark" : "light"} flex justify-center h-[650px] relative`}
    >
      <section className="flex flex-col mr-5 w-[330px]">
        <header className="mb-6 pb-2 border-b border-solid border-gray-300">
          <h1 className="text-gray-500 font-bold">Patient&apos;s Interface</h1>
          <h2 className="text-gray-400">
            Logged in as: <strong>{randomPatient.name}</strong>
          </h2>
        </header>

        <PubNubProvider client={patientClient}>
          <PatientView patient={randomPatient} doctor={randomDoctor} channel={channel} />
        </PubNubProvider>
      </section>

      <section className="flex flex-col ml-5 w-[640px]">
        <header className="mb-6 pb-2 border-b border-solid border-gray-300">
          <h1 className="text-gray-500 font-bold">Doctor&apos;s Interface</h1>
          <h2 className="text-gray-400">
            Logged in as: <strong>{randomDoctor.name}</strong>
          </h2>
        </header>

        <PubNubProvider client={doctorClient}>
          <DoctorView patient={randomPatient} doctor={randomDoctor} channel={channel} />
        </PubNubProvider>
      </section>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute bottom-0 left-0 p-4 m-4 text-xs underline ease-in-out duration-300
                   text-cyan-700 hover:text-slate-700 dark:text-slate-700 dark:hover:text-cyan-700"
      >
        {darkMode ? <MoonOverSun className="inline" /> : <MoonStars className="inline" />}
        <span className="ml-2">Switch to {darkMode ? "Light" : "Dark"} Theme</span>
      </button>
    </main>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AppView />
  </React.StrictMode>,
  document.getElementById("root")
);
