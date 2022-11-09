import { useState, useEffect } from "react";
import { GetUUIDMetadataParameters, ObjectsEvent } from "pubnub";
import { usePubNub } from "pubnub-react";
import { cloneDeep } from "lodash";
import { UserEntity } from "../types";

export const useUser = (options: GetUUIDMetadataParameters = {}): [UserEntity | null, Error] => {
  const jsonOptions = JSON.stringify(options);

  const pubnub = usePubNub();
  const [user, setUser] = useState<UserEntity | null>(null);
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
        const response = await pubnub.objects.getUUIDMetadata(options);
        if (ignoreRequest) return;
        setDoFetch(false);
        setUser(response.data);
      } catch (e) {
        setDoFetch(false);
        setError(e as Error);
      }
    }

    return () => {
      ignoreRequest = true;
    };
  }, [doFetch, options, pubnub.objects]);

  useEffect(() => {
    const listener = {
      objects: (event: ObjectsEvent) => {
        const message = event.message;
        if (message.type !== "uuid") return;

        setUser((user) => {
          const userCopy = cloneDeep(user);

          if (message.data.id == userCopy?.id) {
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

  return [user, error as Error];
};
