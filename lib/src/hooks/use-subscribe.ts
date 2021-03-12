import { useEffect } from "react";
import { SubscribeParameters } from "pubnub";
import { usePubNub } from "pubnub-react";

export const useSubscribe = (options: SubscribeParameters = {}): (() => void) => {
  const pubnub = usePubNub();

  const unsubscribe = () => {
    pubnub.unsubscribe(options);
  };

  useEffect(() => {
    options.channels = options.channels || [];
    options.channelGroups = options.channelGroups || [];

    const currentSubscriptions = pubnub.getSubscribedChannels() || [];
    const currentGroups = pubnub.getSubscribedChannelGroups() || [];

    const subscribeChannels = options.channels.filter((c) => !currentSubscriptions.includes(c));
    const unsubscribeChannels = currentSubscriptions.filter((c) => !options.channels.includes(c));

    const subscribeGroups = options.channelGroups.filter((c) => !currentGroups.includes(c));
    const unsubscribeGroups = currentGroups.filter((c) => !options.channelGroups.includes(c));

    if (subscribeChannels.length || subscribeGroups.length) {
      pubnub.subscribe({
        channels: subscribeChannels,
        channelGroups: subscribeGroups,
        withPresence: options.withPresence,
      });
    }

    if (unsubscribeChannels.length || unsubscribeGroups.length) {
      pubnub.unsubscribe({
        channels: unsubscribeChannels,
        channelGroups: unsubscribeGroups,
      });
    }
  }, [JSON.stringify(options.channels), JSON.stringify(options.channelGroups)]);

  return unsubscribe;
};
