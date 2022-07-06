import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { useChannels } from "@pubnub/react-chat-components";

const pubnub = new PubNub({
  publishKey: "pub-c-c442e30a-69da-45cc-bb6a-e80847b7da1e",
  subscribeKey: "sub-c-f0f75b24-0b1c-11ec-a3aa-62fd72cca367",
  uuid: "mobile-user",
});

export default function App(): JSX.Element {
  return (
    <PubNubProvider client={pubnub}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app! 3</Text>
        <StatusBar style="auto" />
        <Test></Test>
      </View>
    </PubNubProvider>
  );
}

export function Test(): JSX.Element {
  const [channels] = useChannels();

  useEffect(() => {
    console.log(channels);
  }, [channels]);

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
