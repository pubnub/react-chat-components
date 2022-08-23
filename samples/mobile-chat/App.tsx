import React from "react";
import { useColorScheme, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { atom, useAtom } from "jotai";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import users from "../../data/users/users.json";
import {
  useUserMemberships,
  usePresence,
  useChannelMembers,
  MemberList,
  Chat,
  ChannelList,
  ChannelEntity,
} from "@pubnub/react-native-chat-components";

const CurrentChannelAtom = atom<ChannelEntity>(null);
const Stack = createNativeStackNavigator();
const pubnub = new PubNub({
  publishKey: (Constants.manifest.extra.REACT_APP_PUB_KEY as string) || "",
  subscribeKey: (Constants.manifest.extra.REACT_APP_SUB_KEY as string) || "",
  uuid: users[Math.floor(Math.random() * users.length)].id,
});

export default function App(): JSX.Element {
  const [currentChannel] = useAtom(CurrentChannelAtom);
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <PubNubProvider client={pubnub}>
      <Chat currentChannel={currentChannel?.id} theme={theme}>
        <NavigationContainer>
          <StatusBar style={isDark ? "light" : "dark"} />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: isDark ? "#2a2a39" : "#fff",
              },
              headerTintColor: isDark ? "#fff" : "#2a2a39",
            }}
          >
            <Stack.Screen name="Channels" component={ChannelsScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ navigation }) => ({
                title: currentChannel?.name || "Chat",
                headerBackTitle: "",
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Members")}>
                    <Octicons name="people" size={24} color={isDark ? "#fff" : "#2a2a39"} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Members"
              component={MembersScreen}
              options={{
                title: currentChannel?.name || "Members",
                headerBackTitle: "",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Chat>
    </PubNubProvider>
  );
}

export function ChannelsScreen(): JSX.Element {
  const [joinedChannels] = useUserMemberships({
    include: { channelFields: true, customChannelFields: true },
  });
  const [_, setCurrentChannel] = useAtom(CurrentChannelAtom);
  const groupChannels = joinedChannels.filter((c) => c.id?.startsWith("space."));
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const navigation = useNavigation();

  return (
    <ChannelList
      channels={groupChannels}
      onChannelSwitched={(ch) => {
        setCurrentChannel(ch);
        navigation.navigate("Chat");
      }}
      onChannelLongPressed={(ch) => alert(`Hi from ${ch.name}`)}
      // styles={{
      //   channelPressed: {
      //     backgroundColor: "red",
      //   },
      // }}
      // channelRenderer={(ch) => <Text>{ch.name}</Text>}
      extraActionsRenderer={(ch) => (
        <TouchableOpacity onPress={() => alert(`Info about ${ch.name}`)}>
          <Octicons name="info" size={20} color={isDark ? "#929292" : "#9b9b9b"} />
        </TouchableOpacity>
      )}
    >
      {/* <Text>Hello from channels</Text> */}
    </ChannelList>
  );
}

export function ChatScreen(): JSX.Element {
  return null;
}

export function MembersScreen(): JSX.Element {
  const [currentChannel] = useAtom(CurrentChannelAtom);
  const [channelMembers] = useChannelMembers({
    channel: currentChannel?.id,
    include: { customUUIDFields: true },
  });
  const [presenceData] = usePresence({ channels: [currentChannel?.id] });
  const presentUUIDs = presenceData[currentChannel?.id]?.occupants?.map((o) => o.uuid) || [];

  return (
    <MemberList
      members={channelMembers}
      presentMembers={[pubnub.getUUID(), ...presentUUIDs]}
      // styles={{
      //   memberPressed: {
      //     backgroundColor: "red",
      //   },
      // }}
      // memberRenderer={(m) => <Text>{m.name}</Text>}
      // extraActionsRenderer={(m) => (
      //   <Button title="EA" onPress={() => alert(`Extra! from ${m.name}`)}></Button>
      // )}
      // onMemberClicked={(m) => alert(`Clicked: ${m.name}`)}
      // onMemberLongPressed={(m) => alert(`Long pressed: ${m.name}`)}
    >
      {/* <Text>Hello from members</Text> */}
    </MemberList>
  );
}
