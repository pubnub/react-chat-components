import React from "react";
import { faker } from "@faker-js/faker";
import { ChannelEntity } from "@pubnub/react-chat-components";

import { ReactComponent as GroupIcon } from "../assets/user-group.svg";

const randomTitle = faker.random.words(10);
const randomText1 = faker.random.words(50);
const randomText2 = faker.random.words(50);

type StreamViewProps = {
  currentChannel: ChannelEntity;
  channelOccupancy: number;
};

const StreamView = ({ currentChannel, channelOccupancy }: StreamViewProps): JSX.Element => {
  return (
    <main className="flex flex-col grow">
      {/* Video */}
      <div className="overflow-hidden pt-[56.25%] relative">
        {currentChannel?.custom?.source && (
          <iframe
            className="absolute border-0 bottom-0 h-full top-0 w-full"
            src={currentChannel.custom.source as string}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <div className="flex flex-col grow overflow-y-auto">
        {/* Info Bar */}
        <div className="bg-gray-300 dark:bg-navy-900 flex items-center p-4">
          <div className="grow">
            <h4 className="dark:text-gray-200 text-lg text-navy-700">{currentChannel?.name}</h4>
            <span className="dark:text-ocean-600 space-x-5 text-ocean-800 text-sm break-all">
              {(currentChannel?.custom?.tags as string).split(" ").map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </span>
          </div>
          <aside className="dark:text-white flex items-center text-ocean-800">
            <GroupIcon className="mr-2" />
            {channelOccupancy}
            <span className="bg-red font-bold ml-3 px-2 py-0.5 rounded text-sm text-white uppercase">
              Live
            </span>
          </aside>
        </div>

        {/* Content */}
        <div className="bg-gray-300 dark:bg-navy-700 dark:text-gray-600 flex flex-col grow p-5 text-gray-700 text-sm">
          <header className="flex items-center my-3">
            {currentChannel?.custom?.profileUrl && (
              <img
                src={currentChannel.custom.profileUrl as string}
                className="h-10 mr-4 rounded-full w-10"
                alt="Channel Thumb"
              />
            )}
            <div>
              <h2 className="dark:text-white text-base text-black">{currentChannel.description}</h2>
              <span className="text-xs">{currentChannel.custom?.subscribers} followers</span>
            </div>
          </header>

          <ul className="dark:text-white flex font-bold my-5 space-x-5 text-black">
            <li className="border-b-2 border-black cursor-pointer dark:border-white pb-0.5">
              Home
            </li>
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Schedule</li>
          </ul>

          <p className="first-letter:uppercase lowercase mb-5">
            <strong>{randomTitle}</strong>
          </p>
          <p className="first-letter:uppercase leading-relaxed lowercase mb-5">{randomText1}</p>
          <p className="first-letter:uppercase leading-relaxed lowercase mb-5">{randomText2}</p>
        </div>
      </div>
    </main>
  );
};

export default StreamView;
