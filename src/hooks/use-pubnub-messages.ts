import { useState, useEffect } from "react";
import { FetchMessagesParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import { Message } from "../types";
import merge from "lodash.merge";
import mergeWith from "lodash.mergewith";
import cloneDeep from "lodash.clonedeep";

interface MessagesByChannel {
  [channel: string]: Message[];
}

type HookReturnValue = [MessagesByChannel, () => Promise<void>];

export const usePubNubMessages = (
  options: FetchMessagesParameters = {},
  onError = (e) => console.error(e)
): HookReturnValue => {
  const pubnub = usePubNub();
  const [messages, setMessages] = useState<MessagesByChannel>({});
  const [page, setPage] = useState<number>(undefined);
  const [fetchedAll, setFetchedAll] = useState(false);

  const mandatoryOptions = {
    start: page,
  };
  const mergedOptions = merge(options, mandatoryOptions);

  const command = async () => {
    try {
      if (fetchedAll) return;
      const response = await pubnub.fetchMessages(mergedOptions);
      const newMessages = mergeWith({}, messages, response.channels, mergeMessageArray);
      const earliestMessageTimetokens = Object.values(response.channels)
        .flatMap((ary) => ary[0])
        .map((a) => a.timetoken);
      const lastTimetoken = Math.min(...earliestMessageTimetokens);
      setMessages(newMessages);
      setPage(lastTimetoken - 1);
      setFetchedAll(!Object.keys(response.channels).length);
    } catch (e) {
      onError(e);
    }
  };

  const handleMessage = (message) => {
    setMessages((messages) => {
      const messagesClone = cloneDeep(messages);
      messagesClone[message.channel].push(message);
      return messagesClone;
    });
  };

  useEffect(() => {
    command();
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels: options.channels });

    return () => {
      pubnub.unsubscribe({ channels: options.channels });
    };
  }, []);

  return [messages, command];
};

const mergeMessageArray = (oldMessages, newMessages) => {
  if (Array.isArray(oldMessages)) {
    return [...oldMessages, ...newMessages].sort(
      (a, b) => (a.timetoken as number) - (b.timetoken as number)
    );
  }
};
