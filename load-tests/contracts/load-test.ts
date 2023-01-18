import { envelope, successfulResponse, timetokenData } from "../utils/subscribe";
import {
  rand,
  randFullName,
  randHexaDecimal,
  randPhrase,
  randRecentDate,
  randSkill,
  randUuid,
} from "@ngneat/falso";

export const name = "loadTest";

function generateUsers(amount: number) {
  return Array.from(Array(amount), () => {
    const uuid = randUuid();
    return {
      name: randFullName(),
      custom: {
        title: randSkill(),
      },
      email: null,
      eTag: randHexaDecimal({ length: 10 }).join(""),
      externalId: null,
      id: uuid,
      profileUrl: `https://i.pravatar.cc/36?u=${uuid}`,
      updated: randRecentDate(),
    };
  });
}

function generatePayload(user) {
  return {
    type: "default",
    text: randPhrase(),
    sender: user,
  };
}

function generateEnvelopes({ startTimetoken, amount, channel, subKey, users }) {
  const result = [];
  let start = BigInt(startTimetoken);

  for (let i = 0; i < amount; i++) {
    const messageTimetoken = (start++).toString();
    const user = rand(users);

    result.push(
      envelope({
        channel: channel,
        sender: user.id,
        subKey: subKey,
        publishingTimetoken: {
          t: messageTimetoken,
          r: 0,
        },
        payload: generatePayload(user),
      })
    );
  }

  return result;
}

export default async function (input) {
  const users = generateUsers(Number(input.users));
  let currentTimetoken = timetoken.now();

  const request = await expect({
    description: "subscribe with timetoken zero",
    validations: [],
  });

  await request.respond({
    status: 200,
    body: successfulResponse(timetokenData(currentTimetoken)),
  });

  while (true) {
    await Promise.all([
      sleep((1 / Number(input.chunksPerSecond)) * 1000),
      expect({
        description: "subscribe next",
        validations: [],
      }).then(async (request) => {
        const envelopes = generateEnvelopes({
          startTimetoken: currentTimetoken,
          amount: Number(input.messagesPerChunk),
          channel: input.channel,
          subKey: input.subscribeKey,
          users,
        });
        const nextTimetoken = timetoken.now();
        await request.respond({
          status: 200,
          body: successfulResponse(timetokenData(nextTimetoken), envelopes),
        });
        currentTimetoken = nextTimetoken;
      }),
    ]);
  }
}
