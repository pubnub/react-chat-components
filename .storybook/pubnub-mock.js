const mockUsers = () => [
  {
    uuid: {
      id: "user_fbc9a54790b24ee19441260970b171c0",
      name: "Adelia Auten",
      profileUrl:
        "https://www.gravatar.com/avatar/823948c23e7d8354649cc65a8f77e7a9?s=256&d=identicon",
      custom: {
        title: "VP Marketing",
      },
    },
  },
  {
    uuid: {
      id: "user_912210948aa849eda2c3e0c2b58355e6",
      name: "Danna Delacruz",
      profileUrl:
        "https://www.gravatar.com/avatar/760d4ae535f004e86140426177f7ca58?s=256&d=identicon",
      custom: {
        title: "Desktop Support Technician",
      },
    },
  },
  {
    uuid: {
      id: "user_53bbe00387004010a8b9ad5f36bdd4a7",
      name: "Gertie Gibbon",
      profileUrl:
        "https://www.gravatar.com/avatar/9e95672bf3246dc07b37f3b8668c5653?s=256&d=identicon",
      custom: {
        title: "Account Representative II",
      },
    },
  },
  {
    uuid: {
      id: "user_f04ca61de8ba44af8e50ed5bd37ff822",
      name: "Janeen Jefferson",
      profileUrl:
        "https://www.gravatar.com/avatar/cc912bd3fd19798ed0714c3b3cc4c48f?s=256&d=identicon",
      custom: {
        title: "Desktop Support Technician",
      },
    },
  },
  {
    uuid: {
      id: "user_55f74958eb00441f8171f4f8757b0f24",
      name: "Lakenya Logan",
      profileUrl:
        "https://www.gravatar.com/avatar/7c053f2fa508cb786468ade12ac35ecd?s=256&d=identicon",
      custom: {
        title: "Office Assistant III",
      },
    },
  },
  {
    uuid: {
      id: "user_a7f0471fb9c64a00af7b3029234cff99",
      name: "Nathaniel Nestor",
      profileUrl:
        "https://www.gravatar.com/avatar/ab6bda42b4db1d90f705cc109360bb55?s=256&d=identicon",
      custom: {
        title: "Mechanical Systems Engineer",
      },
    },
  },
  {
    uuid: {
      id: "user_6ef19fcc68824f9f9e3d908d796f21a3",
      name: "Osvaldo Oh",
      profileUrl:
        "https://www.gravatar.com/avatar/de7120222a16e2a1d56d5ea375ebe196?s=256&d=identicon",
      custom: {
        title: "Paralegal",
      },
    },
  },
  {
    uuid: {
      id: "user_4205ea2b9cc549048d4b2e9da389c348",
      name: "Sally Southworth",
      profileUrl:
        "https://www.gravatar.com/avatar/cfdcbb638ff2ba74ec3dbc4a44cbfb70?s=256&d=identicon",
      custom: {
        title: "Paralegal",
      },
    },
  },
  {
    uuid: {
      id: "user_31be78e92e4e4218808007047cbdcebb",
      name: "Tajuana Topete",
      profileUrl:
        "https://www.gravatar.com/avatar/7de36a5bc36536ad6ceb3981411c3ffb?s=256&d=identicon",
      custom: {
        title: "Food Chemist",
      },
    },
  },
  {
    uuid: {
      id: "user_d2669ccf033f46c79b0adda40cf3383c",
      name: "Zana Zimmerman",
      profileUrl:
        "https://www.gravatar.com/avatar/188399a6feef5e3f54ea4a58528faf32?s=256&d=identicon",
      custom: {
        title: "Programmer II",
      },
    },
  },
];

const mockMessages = () => [
  {
    message: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      type: "text",
    },
    timetoken: "16068528857793347",
    uuid: "user_fbc9a54790b24ee19441260970b171c0",
  },
  {
    message: {
      text: "Vivamus ut justo rhoncus mi elementum blandit vel vel velit.",
      type: "text",
    },
    timetoken: "16069194583897454",
    uuid: "user_53bbe00387004010a8b9ad5f36bdd4a7",
  },
  {
    message: {
      text: "In at sapien nec tortor viverra laoreet sit amet vitae mauris.",
      type: "text",
    },
    timetoken: "16069255760118490",
    uuid: "user_55f74958eb00441f8171f4f8757b0f24",
  },
  {
    message: {
      text: "Integer sollicitudin eros nec libero vulputate, nec faucibus erat tristique.",
      type: "text",
    },
    timetoken: "16069261926915892",
    uuid: "user_6ef19fcc68824f9f9e3d908d796f21a3",
  },
  {
    message: {
      text: "Curabitur id quam ac mauris aliquet imperdiet quis eget nisl.",
      type: "text",
    },
    timetoken: "16070944454879114",
    uuid: "user_31be78e92e4e4218808007047cbdcebb",
    actions: {
      reaction: {
        "👍": [
          {
            uuid: "user_0a0579891c7148009ec254f7ae2e6367",
            actionTimetoken: "16069174870966352",
          },
        ],
      },
    },
  },
];

const mockChannels = () => [
  {
    id: "space_ce466f2e445c38976168ba78e46",
    name: "Company Culture",
    description: "Company culture space",
  },
  {
    id: "space_2ada61db17878cd388f95da34f9",
    name: "Daily Standup",
    description: "Async virtual standup",
  },
  {
    id: "space_e1eda2fd92e551358e4af1b6174",
    name: "Exec AMA",
    description: "Ask the CEO anything",
  },
  {
    id: "space_515fc9a2a1a895f4059c84b2971",
    name: "India Office",
    description: "भारत के कार्यालय में आपका स्वागत है🇮🇳!",
  },
  {
    id: "space_ac4e67b98b34b44c4a39466e93e",
    name: "Introductions",
    description: "Company wide chatter",
  },
  {
    id: "space_a652eb6cc340334ff0b244c4a39",
    name: "London Office",
    description: "London Office 🇬🇧",
  },
  {
    id: "space_149e60f311749f2a7c6515f7b34",
    name: "Movies",
    description: "Everything about movies",
  },
  {
    id: "space_a204f87d215a40985d35cf84bf5",
    name: "Off Topic",
    description: "Water cooler conversations",
  },
  {
    id: "space_c1ee1eda28554d0a34f9b9df5cfe",
    name: "Poland Office",
    description: "Zapytaj Nas O Cokolwiek 🇵🇱",
  },
  {
    id: "space_363d9255193e45f190539e0c7d5",
    name: "Running",
    description: "soc-running space",
  },
];

export function PubNubMock() {
  const listeners = {};
  const messages = mockMessages();
  const users = mockUsers();
  const channels = mockChannels();
  const actions = [];
  const uuid = "user_fbc9a54790b24ee19441260970b171c0";

  return {
    addMessageAction: (obj) => {
      const action = {
        channel: obj.channel,
        data: {
          messageTimetoken: obj.messageTimetoken,
          actionTimetoken: Date.now() + "0000",
          type: obj.action.type,
          uuid,
          value: obj.action.value,
        },
        event: "added",
        publisher: uuid,
        timetoken: Date.now() + "0000",
      };
      actions.push(action);
      listeners.messageAction(action);
    },
    addListener: (obj) => Object.assign(listeners, obj),
    fetchMessages: (args) => ({
      channels: {
        [args.channels[0]]: messages,
      },
    }),
    getUUID: () => uuid,
    hereNow: (args) => ({
      channels: {
        [args.channels[0]]: {
          occupants: [
            { uuid },
            { uuid: "user_53bbe00387004010a8b9ad5f36bdd4a7" },
            { uuid: "user_55f74958eb00441f8171f4f8757b0f24" },
            { uuid: "user_6ef19fcc68824f9f9e3d908d796f21a3" },
            { uuid: "user_31be78e92e4e4218808007047cbdcebb" },
          ],
        },
      },
    }),
    publish: (obj) => {
      const message = {
        message: obj.message,
        timetoken: Date.now() + "0000",
        uuid,
      };
      messages.push(message);
      listeners.message(message);
    },
    removeMessageAction: (obj) => {
      const action = actions.find((a) => a.data.actionTimetoken === obj.actionTimetoken);
      const index = actions.indexOf(action);
      actions.splice(index, 1);
      action.event = "removed";
      listeners.messageAction(action);
    },
    signal: () => true,
    stop: () => true,
    subscribe: () => true,
    unsubscribe: () => true,
    objects: {
      getAllChannelMetadata: () => ({
        data: channels,
      }),
      getChannelMembers: () => ({
        data: users,
      }),
      getMemberships: () => ({
        data: [
          { channel: { id: "space_ac4e67b98b34b44c4a39466e93e" } },
          { channel: { id: "space_c1ee1eda28554d0a34f9b9df5cfe" } },
          { channel: { id: "space_ce466f2e445c38976168ba78e46" } },
          { channel: { id: "space_a204f87d215a40985d35cf84bf5" } },
          { channel: { id: "space_149e60f311749f2a7c6515f7b34" } },
        ],
      }),
      getUUIDMetadata: (args) => ({
        data: users.find((u) => u.uuid.id === args.uuid).uuid,
      }),
      setMemberships: () => true,
      removeMemberships: () => true,
    },
  };
}
