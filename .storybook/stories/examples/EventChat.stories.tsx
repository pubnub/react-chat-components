// import React from "react";
// import { Story, Meta } from "@storybook/react";
// import { PubNubProvider, MessageList, MessageInput } from "../../../src";
// import "./EventChat.css";

// const channels = ["polsatgames2", "izakooo", "dota2ruhub"];

// export default {
//   title: "Examples / Event Chat",
//   parameters: {
//     docs: { page: null },
//     smth: "as well",
//   },
// } as Meta;

// const Template: Story = () => {
//   return (
//     <div className="event-app">
//       <div className="event-main">
//         <div className="event-channels">
//           Popular channels:
//           {channels.map((channel) => (
//             <span className="event-link" onClick={() => setChannel(channel)}>
//               {channel}
//             </span>
//           ))}
//         </div>

//         <div className="event">
//           <iframe
//             src={`https://player.twitch.tv/?channel=${channel}&parent=localhost`}
//             frameBorder="0"
//             allowFullScreen={true}
//             scrolling="no"
//             title="Stream"
//           />
//           <div className="event-chat">
//             <MessageList />
//             <MessageInput />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const Default = Template.bind({});
