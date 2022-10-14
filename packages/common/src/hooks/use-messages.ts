import { useState, useEffect, useRef } from "react";
import { FetchMessagesParameters, MessageActionEvent, MessageEvent } from "pubnub";
import { usePubNub } from "pubnub-react";
import { MessageEnvelope } from "../types";
import { merge, mergeWith, cloneDeep, set as setDeep } from "lodash";

interface MessagesByChannel {
  [channel: string]: MessageEnvelope[];
}

type HookReturnValue = [MessagesByChannel, () => Promise<void>, Error];

export const useMessages = (options: FetchMessagesParameters): HookReturnValue => {
  const pubnub = usePubNub();

  const [messages, setMessages] = useState<MessagesByChannel>(() => {
    const initial = {};
    options.channels.forEach((channel) => (initial[channel] = []));
    return initial;
  });
  const [page, setPage] = useState<number>(undefined);
  const [fetchedAll, setFetchedAll] = useState(false);
  const [error, setError] = useState<Error>();

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
        .map((a) => a.timetoken) as number[];
      const lastTimetoken = Math.min(...earliestMessageTimetokens);
      setMessages(newMessages);
      setPage(lastTimetoken - 1);
      setFetchedAll(!Object.keys(response.channels).length);
    } catch (e) {
      setError(e);
    }
  };

  const handleMessage = (message: MessageEvent) => {
    try {
      setMessages((messages) => {
        const messagesClone = cloneDeep(messages);
        if (!messagesClone[message.channel]) messagesClone[message.channel] = [];
        messagesClone[message.channel].push(message);
        return messagesClone;
      });
    } catch (e) {
      setError(e);
    }
  };

  const handleAction = (action: MessageActionEvent) => {
    try {
      if (!messages[action.channel]) return;

      setMessages((messages) => {
        const { channel, event } = action;
        const { type, value, actionTimetoken, messageTimetoken, uuid } = action.data;
        const messagesClone = cloneDeep(messages);
        const message = messagesClone[channel].find((m) => m.timetoken === messageTimetoken);
        const actions = message?.actions?.[type]?.[value] || [];

        if (message && event === "added") {
          const newActions = [...actions, { uuid, actionTimetoken }];
          setDeep(message, ["actions", type, value], newActions);
        }

        if (message && event === "removed") {
          const newActions = actions.filter((a) => a.actionTimetoken !== actionTimetoken);
          newActions.length
            ? setDeep(message, ["actions", type, value], newActions)
            : delete message.actions[type][value];
        }

        return messagesClone;
      });
    } catch (e) {
      setError(e);
    }
  };

  const listener = useRef({
    message: handleMessage,
    messageAction: handleAction,
  });

  useEffect(() => {
    command();
    pubnub.addListener(listener.current);

    return () => {
      pubnub.removeListener(listener.current);
    };
  }, [pubnub]);

  return [messages, command, error];
};

const mergeMessageArray = (oldMessages, newMessages) => {
  if (Array.isArray(oldMessages)) {
    return [...oldMessages, ...newMessages].sort(
      (a, b) => (a.timetoken as number) - (b.timetoken as number)
    );
  }
};
