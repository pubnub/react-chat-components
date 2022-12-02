import React, { ChangeEvent, FormEvent, useState } from "react";
import { UserEntity } from "@pubnub/react-chat-components";
import { actionCompleted } from "pubnub-demo-integration";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as LogoDark } from "../assets/logo-dark.svg";
import { ReactComponent as KeyIcon } from "../assets/key.svg";
import { ReactComponent as UserIcon } from "../assets/user.svg";
import { ReactComponent as Spinner } from "../assets/spinner.svg";
import splashUrl from "../assets/splash.png";
import jsonUsers from "../data/users.json";
const users = jsonUsers as Array<UserEntity & { type: string }>;

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

type LoginViewProps = {
  setUser: (user: UserEntity & { type: string }) => void;
  darkMode: boolean;
};

export default function LoginView(props: LoginViewProps): JSX.Element {
  const { setUser, darkMode } = props;
  const [userInput, setUserInput] = useState(users[0].custom?.username as string);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await timeout(500);
    setLoading(false);
    const user = users.find((u) => u?.custom?.username === userInput);
    if (user) {
      setUser(user);
      actionCompleted({
        action:
          user.type === "patient" ? "Log in as a Patient" : "Log in as a Doctor (in a new tab)",
      });
    } else setError(true);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (error) setError(false);
    setUserInput(e.target.value);
  };

  return (
    <main className="login-view flex flex-row w-full h-full dark:bg-gray-800 dark:text-gray-100">
      <section className="flex flex-col w-1/2">
        <header className="flex flex-col grow justify-center items-center">
          {darkMode ? <LogoDark /> : <Logo />}
          <form onSubmit={handleSubmit} className="flex flex-col w-[364px] mt-16 relative">
            {loading && (
              <div className="absolute w-full h-full bg-white dark:bg-gray-800 z-10 flex items-center justify-center opacity-50 pb-16">
                <Spinner />
              </div>
            )}
            <h3 className="text-xl font-semibold mb-8">Log in</h3>
            <label className="mb-6 text-sm relative">
              Username
              <select
                name="username"
                value={userInput}
                onChange={handleChange}
                className={`block w-full rounded border px-10 py-2.5 mt-2 focus:border-blue-900
                  outline-0 dark:bg-gray-800 text-gray-700 dark:text-gray-100 appearance-none
                  ${error ? "border-red-700 dark:border-red-600" : "border-gray-300"}
                `}
              >
                {users.map((u) => (
                  <option key={u.name} value={u.custom?.username as string}>
                    {u.name} ({u.type})
                  </option>
                ))}
              </select>
              <UserIcon className="absolute left-3.5 bottom-3" />
              <span className="absolute right-3.5 bottom-3">▾</span>
            </label>
            <label className="mb-8 text-sm relative">
              Password
              <input
                type="text"
                name="password"
                className="block w-full rounded border border-gray-300 px-10 py-2.5 mt-2 text-gray-700
                  dark:bg-gray-800"
                placeholder="no password is required"
                disabled
              />
              <KeyIcon className="absolute left-3.5 bottom-3" />
            </label>
            <input
              type="submit"
              className="text-white bg-cyan-700 hover:bg-cyan-600 py-3 rounded font-semibold cursor-pointer"
              value="Log in"
            />
            <p className={`text-red-700 dark:text-red-600 mt-6 ${error ? "visible" : "invisible"}`}>
              This username is not recognized, please check valid accounts on the{" "}
              <a className="cursor-pointer font-semibold underline">Demo page</a>
            </p>
          </form>
        </header>

        <footer className="w-full px-20 py-10 dark:bg-black bg-gray-100">
          This is a sample app that doesn’t require a password. A list of valid usernames can be
          found at the&nbsp;
          <a
            className="text-cyan-700 underline font-semibold"
            href="https://github.com/pubnub/react-chat-components/tree/master/samples/react/telehealth"
            rel="noreferrer"
            target="_blank"
          >
            Demo page
          </a>
        </footer>
      </section>

      <section
        className="grow bg-no-repeat bg-cover bg-center w-1/2"
        style={{ backgroundImage: `url(${splashUrl})` }}
      />
    </main>
  );
}
