import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Platform } from "react-native";
import { NavigationContainer, Route } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { tests } from "../common/constants";
import React, { Profiler, useEffect, useMemo, useState } from "react";
import { PubNubProvider } from "pubnub-react";
import { Chat, MessageInput, MessageList } from "@pubnub/react-native-chat-components";
import PubNub from "pubnub";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const currentChannel = "test-channel";
const pubnub = new PubNub({
  origin: "localhost:8090",
  publishKey: "demo",
  subscribeKey: "demo",
  userId: "test-user",
});

type HomeScreenProps = {
  navigation: {
    navigate: (screenName: string, params: any) => void;
  };
};

type TestProps = {
  route: Route<"Test", { contractParams: URLSearchParams }>;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>RCC Load Tester</Text>
      <Text>RUN THIS TEST ONLY AFTER LAUNCHING REACT NATIVE DEBUGGER WITH NETWORK ENABLED</Text>
      <View>
        {tests.map((test) => {
          return (
            <Button
              title={`${test.name} ${JSON.stringify(test.options, null, 2)}`}
              onPress={() =>
                navigation.navigate("Test", {
                  contractParams: new URLSearchParams(test.options),
                })
              }
              key={test.name}
            />
          );
        })}
      </View>
    </View>
  );
}

function Test({ route }: TestProps) {
  const { contractParams } = route.params;
  const perfMap = useMemo(() => new Map(), []);
  const [msgCount, setMsgCount] = useState(0);

  function logPerformance(profilerId, mode, actualTime) {
    if (actualTime) {
      const time = Math.floor(actualTime);
      perfMap.set(msgCount, time);
    }
    console.log("perfMap", perfMap);
  }

  function handleMessage() {
    setMsgCount((count) => count + 1);
  }

  useEffect(() => {
    console.log("Recording MessageList performance...");
    initContract();

    async function initContract() {
      try {
        await fetch(
          `https://localhost:8090/init?__contract__script__=loadTest&subscribeKey=demo&channel=${currentChannel}&${contractParams}`
        );
      } catch (err) {
        console.log("err?", err);
      }
    }

    return () => {
      pubnub.unsubscribeAll();
      console.log(perfMap);
    };
  }, [contractParams, perfMap]);

  return (
    <PubNubProvider client={pubnub}>
      <Chat currentChannel={currentChannel} onMessage={handleMessage} onError={console.log}>
        <Profiler id="message-list" onRender={logPerformance}>
          <MessageList />
        </Profiler>
        <MessageInput />
      </Chat>
    </PubNubProvider>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingViewContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Test" component={Test} />
            </Stack.Navigator>
          </NavigationContainer>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingViewContainer: {
    flex: 1,
  },
});

export default App;
