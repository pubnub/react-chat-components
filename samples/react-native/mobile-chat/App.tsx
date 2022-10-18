import React from "react";
import { useColorScheme, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAtom } from "jotai";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import { Chat, Themes, useUsers } from "@pubnub/react-native-chat-components";

import { CurrentChannelsScreen, ChannelMembersScreen, ChatScreen } from "./screens";
import { CurrentChannelAtom } from "./state-atoms";
import users from "../../../data/users/users.json";

type RootStackParamList = {
  Channels: undefined;
  Chat: undefined;
  Members: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const pubnub = new PubNub({
  publishKey: (Constants.manifest?.extra?.REACT_APP_PUB_KEY as string) || "",
  subscribeKey: (Constants.manifest?.extra?.REACT_APP_SUB_KEY as string) || "",
  userId: users[Math.floor(Math.random() * users.length)].id,
});

export default function App(): JSX.Element {
  return (
    <PubNubProvider client={pubnub}>
      <ChatWrapper />
    </PubNubProvider>
  );
}

export function ChatWrapper(): JSX.Element {
  const [currentChannel] = useAtom(CurrentChannelAtom);
  const [users] = useUsers({ include: { customFields: true } });
  const theme = useColorScheme() as Themes;
  const isDark = theme === "dark";

  return (
    <Chat currentChannel={currentChannel?.id} theme={theme} users={users}>
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
          <Stack.Screen name="Channels" component={CurrentChannelsScreen} />
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
            component={ChannelMembersScreen}
            options={{
              title: currentChannel?.name || "Members",
              headerBackTitle: "",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Chat>
  );
}
