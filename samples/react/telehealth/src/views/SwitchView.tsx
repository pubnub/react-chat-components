import React, { useEffect, useState } from "react";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { UserEntity } from "@pubnub/react-chat-components";

import { ReactComponent as UnlockIcon } from "../assets/unlock.svg";
import PatientView from "./PatientView";
import DoctorView from "./DoctorView";
import LoginView from "./LoginView";
import users from "../data/users.json";

export default function SwitchView(props: { darkMode: boolean }): JSX.Element {
  const { darkMode } = props;
  const [user, setUser] = useState<UserEntity & { type: string }>();
  const [pubnub, setPubnub] = useState<PubNub>();

  useEffect(() => {
    if (!user) return;
    /**
     * Please populate "samples/.env" file with your PubNub keyset before running this app
     */
    const pn = new PubNub({
      publishKey: import.meta.env.REACT_APP_PUB_KEY as string,
      subscribeKey: import.meta.env.REACT_APP_SUB_KEY as string,
      uuid: user.id,
    });
    setPubnub(pn);
  }, [user]);

  if (!user) return <LoginView {...{ users, setUser, darkMode }} />;
  if (!pubnub) return <></>;

  return (
    <PubNubProvider client={pubnub}>
      <button
        onClick={() => setUser(undefined)}
        className="absolute top-10 right-0 p-4 m-4 mr-8 text-xs underline ease-in-out duration-300
        text-slate-700 hover:text-slate-700"
      >
        <UnlockIcon className="inline" />
        <span className="ml-2">Log out</span>
      </button>

      {user.type === "patient" ? <PatientView patient={user} /> : <DoctorView doctor={user} />}
    </PubNubProvider>
  );
}
