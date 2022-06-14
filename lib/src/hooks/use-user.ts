import { useState, useEffect } from "react";
import { usePubNub } from "pubnub-react";
import cloneDeep from "lodash.clonedeep";
import { VSPPubnub, FetchUserParameters, UserEntity } from "../types";

export const useUser = (options: FetchUserParameters = {}): [UserEntity, Error] => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub() as VSPPubnub;
  const [user, setUser] = useState(null);
  const [error, setError] = useState<Error>();
  const [doFetch, setDoFetch] = useState(true);

  const resetHook = () => {
    setUser(null);
    setError(undefined);
    setDoFetch(true);
  };

  useEffect(() => {
    resetHook();
  }, [jsonOptions]);

  useEffect(() => {
    let ignoreRequest = false;
    if (doFetch) fetch();

    async function fetch() {
      try {
        const response = await pubnub.fetchUser(options);
        if (ignoreRequest) return;
        setDoFetch(false);
        setUser(response.data);
      } catch (e) {
        setDoFetch(false);
        setError(e);
      }
    }

    return () => {
      ignoreRequest = true;
    };
  }, [doFetch, options, pubnub]);

  useEffect(() => {
    const listener = {
      objects: (event) => {
        const message = event.message;
        if (message.type !== "uuid") return;

        setUser((user) => {
          const userCopy = cloneDeep(user);

          if (message.data.id == user.id) {
            Object.assign(userCopy, message.data);
          }

          return userCopy;
        });
      },
    };

    pubnub.addListener(listener);

    return () => {
      pubnub.removeListener(listener);
    };
  }, [pubnub]);

  return [user, error];
};
