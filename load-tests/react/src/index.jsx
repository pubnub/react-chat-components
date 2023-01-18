import { useEffect, useMemo, Profiler } from "react";
import { createRoot } from "react-dom/client";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import { Chat, MessageList, MessageInput } from "@pubnub/react-chat-components";
import {
  Outlet,
  RouterProvider,
  Link,
  createReactRouter,
  createRouteConfig,
} from "@tanstack/react-router";
import { tests } from "../../common/constants";

const rootRoute = createRouteConfig();
const indexRoute = rootRoute.createRoute({ path: "/", component: Index });
const testRoute = rootRoute.createRoute({ path: "/test", component: Test });
const routeConfig = rootRoute.addChildren([indexRoute, testRoute]);
const router = createReactRouter({ routeConfig });

const currentChannel = "test-channel";
const pubnub = new PubNub({
  origin: "localhost:8090",
  publishKey: "demo",
  subscribeKey: "demo",
  userId: "test-user",
});

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </>
  );
}

function Index() {
  return (
    <main className="wrapper">
      <h1>RCC Load Tester</h1>
      <nav className="buttons">
        {tests.map((test) => {
          return (
            <Link
              to={`/test?${new URLSearchParams(test.options)}`}
              className="button"
              key={test.name}
            >
              <h3>{test.name}</h3>
              <pre>{JSON.stringify(test.options, null, 2)}</pre>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}

function Test() {
  const perfMap = useMemo(() => new Map(), []);

  function logPerformance(profilerId, mode, actualTime) {
    if (actualTime) {
      const msgsNo = document.querySelectorAll(".pn-msg").length;
      const time = Math.floor(actualTime);
      perfMap.set(msgsNo, time);
    }
  }

  useEffect(() => {
    console.log("Recording MessageList performance...");
    initContract();

    async function initContract() {
      await fetch(
        `http://localhost:8090/init?__contract__script__=loadTest&subscribeKey=demo&channel=${currentChannel}&${window.location.search.substring(
          1
        )}`
      );
    }

    return () => {
      pubnub.unsubscribeAll();
      console.log(perfMap);
    };
  }, [perfMap]);

  return (
    <PubNubProvider client={pubnub}>
      <Chat currentChannel={currentChannel}>
        <Profiler id="message-list" onRender={logPerformance}>
          <MessageList />
        </Profiler>
        <MessageInput />
      </Chat>
    </PubNubProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
