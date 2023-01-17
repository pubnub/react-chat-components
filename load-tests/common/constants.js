export const tests = [
  {
    name: "Relaxed Test",
    options: {
      messagesPerChunk: 1,
      chunksPerSecond: 1,
      users: 1,
    },
  },
  {
    name: "Medium Volume Test",
    options: {
      messagesPerChunk: 3,
      chunksPerSecond: 2,
      users: 4,
    },
  },
  {
    name: "High Volume Test",
    options: {
      messagesPerChunk: 10,
      chunksPerSecond: 4,
      users: 8,
    },
  },
  {
    name: "Ultra Volume Test",
    options: {
      messagesPerChunk: 100,
      chunksPerSecond: 4,
      users: 8,
    },
  },
];
