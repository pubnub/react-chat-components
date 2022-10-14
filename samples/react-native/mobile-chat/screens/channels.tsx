import React from "react";
import { useColorScheme, TouchableOpacity, Text } from "react-native";
import { useAtom } from "jotai";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { ChannelList, useChannels } from "@pubnub/react-native-chat-components";
import { CurrentChannelAtom } from "../state-atoms";

export function CurrentChannelsScreen(): JSX.Element {
  const [allChannels] = useChannels({ include: { customFields: true } });
  const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
  const navigation = useNavigation<NavigationProp<{ Chat: undefined }>>();
  const groupChannels = allChannels.filter((c) => c.id?.startsWith("space."));
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ChannelList
      channels={groupChannels}
      onChannelSwitched={(ch) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setCurrentChannel(ch);
        navigation.navigate("Chat");
      }}
      // onChannelLongPressed={(ch) => alert(`Hi from ${ch.name}`)}
      // sort={(ch1, ch2) => (ch1.name > ch2.name ? -1 : 1)}
      style={{
        // channelPressed: {
        //   backgroundColor: "red",
        // },
        channelActive: {
          backgroundColor: "transparent",
        },
      }}
      // channelRenderer={(ch) => <Text>{ch.name}</Text>}
      // extraActionsRenderer={(ch) => (
      //   <TouchableOpacity onPress={() => alert(`Info about ${ch.name}`)}>
      //     <Octicons name="info" size={20} color={isDark ? "#929292" : "#9b9b9b"} />
      //   </TouchableOpacity>
      // )}
    >
      {/* <Text style={{ padding: 20 }}>Hello from channels</Text> */}
    </ChannelList>
  );
}
