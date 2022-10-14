import React, { useState, useRef } from "react";
import { usePubNub } from "pubnub-react";
import { actionCompleted } from "pubnub-demo-integration";
import useClickAway from "react-use/lib/useClickAway";
import {
  ChannelEntity,
  ChannelList,
  usePresence,
  getNameInitials,
  getPredefinedColor,
} from "@pubnub/react-chat-components";

import { ReactComponent as ExpandIcon } from "../assets/expand.svg";
import { ReactComponent as EllipsisIcon } from "../assets/ellipsis-vertical.svg";
import { ReactComponent as MoonIcon } from "../assets/moon-over-sun.svg";
import { ReactComponent as QuestionIcon } from "../assets/question-check.svg";

type ChannelsViewProps = {
  channels: ChannelEntity[];
  channelsExpanded: boolean;
  darkMode: boolean;
  presence: ReturnType<typeof usePresence>[0];
  setChannelsExpanded: (val: boolean) => void;
  setCurrentChannel: (val: ChannelEntity) => void;
  setDarkMode: (val: boolean) => void;
};

const ChannelsView = (props: ChannelsViewProps): JSX.Element => {
  const {
    channels,
    channelsExpanded,
    darkMode,
    presence,
    setChannelsExpanded,
    setCurrentChannel,
    setDarkMode,
  } = props;
  const pubnub = usePubNub();
  const userName = pubnub.getUUID();
  const userMenuRef = useRef(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  useClickAway(userMenuRef, () => setShowUserMenu(!showUserMenu), ["click"]);

  return (
    <aside
      className={`events-view flex flex-col ${
        channelsExpanded
          ? "absolute h-full md:static md:w-[280px] xl:w-[360px] w-full wide z-10"
          : "narrow w-[70px]"
      }`}
    >
      <header className="bg-gray-400 dark:bg-navy-900 dark:text-gray-200 flex h-14 items-center px-5 shrink-0 text-ocean-800">
        <h4 className={`font-bold grow text-sm uppercase ${!channelsExpanded && "hidden"}`}>
          Live channels
        </h4>
        <button
          className={`p-2 ${!channelsExpanded && "rotate-180"}`}
          onClick={() => setChannelsExpanded(!channelsExpanded)}
        >
          <ExpandIcon />
        </button>
      </header>

      <div className="grow">
        <ChannelList
          channels={channels}
          onChannelSwitched={(ch) => setCurrentChannel(ch)}
          extraActionsRenderer={(ch) => (
            <span className="dark:text-gray-600 flex items-center text-navy-700 text-sm">
              <span className="bg-red h-1.5 mr-1 rounded-full w-1.5"></span>
              {presence[ch.id]?.occupancy || 0}
            </span>
          )}
        />
      </div>

      <div className="relative shrink-1">
        <hr className="border-1 border-white dark:border-navy-600" />
        <div className="dark:bg-navy-700 dark:text-gray-200 flex items-center px-3.5 py-3">
          <button
            className="dark:text-navy-700 flex font-bold h-9 items-center justify-center mr-5 rounded-full shrink-0 text-[10px] text-white uppercase w-9"
            style={{ backgroundColor: getPredefinedColor(userName) }}
            onClick={() => !channelsExpanded && setShowUserMenu(!showUserMenu)}
          >
            {getNameInitials(userName)}
          </button>
          <span
            className={`dark:text-gray-200 grow text-[13px] text-gray-700 ${
              !channelsExpanded && "hidden"
            }`}
          >
            {userName}
          </span>
          <button
            className={`dark:hover:bg-navy-600 dark:text-gray-200 flex h-9 hover:bg-gray-400 items-center justify-center rounded-full text-gray-700 w-9 ${
              !channelsExpanded && "hidden"
            }`}
            onClick={() => setShowUserMenu(true)}
          >
            <EllipsisIcon />
          </button>
        </div>

        {showUserMenu && (
          <nav
            ref={userMenuRef}
            className={`absolute bg-white bottom-[50px] dark:bg-navy-700 flex flex-col py-2 rounded-lg shadow-xl ${
              channelsExpanded ? "md:right-[-120px] right-12" : "right-[-120px]"
            }`}
          >
            <button
              className="text-xs text-gray-700 py-2 px-3 items-center hover:bg-gray-300 flex dark:text-white dark:hover:bg-navy-900"
              onClick={() => {
                setDarkMode(!darkMode);
                setShowUserMenu(false);
                if (darkMode)
                  actionCompleted({ action: "Switch to Light Mode", blockDuplicateCalls: true });
              }}
            >
              <MoonIcon className="mr-3 w-6" />
              {darkMode ? "Light" : "Dark"} Theme
            </button>
            <button className="dark:text-gray-700 flex items-center px-3 py-2 text-gray-500 text-xs">
              <QuestionIcon className="mr-3 w-6" />
              Dummy Item
            </button>
          </nav>
        )}
      </div>
    </aside>
  );
};

export default ChannelsView;
