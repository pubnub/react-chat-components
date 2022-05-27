import { useState, useEffect } from "react";
import { GetUUIDMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import cloneDeep from "lodash.clonedeep";
import { UserEntity } from "../types";

export const useUser = (options: GetUUIDMetadataParameters = {}): [UserEntity, Error] => {
  const pubnub = usePubNub();

  const [user, setUser] = useState(null);
  const [error, setError] = useState<Error>();

  const command = async () => {
    try {
      const response = await pubnub.objects.getUUIDMetadata(options);
      setUser(response.data);
    } catch (e) {
      setError(e);
    }
  };

  const handleObject = (event) => {
    const message = event.message;
    if (message.type !== "uuid") return;

    setUser((user) => {
      const userCopy = cloneDeep(user);

      if (message.data.id == user.id) {
        Object.assign(userCopy, message.data);
      }

      return userCopy;
    });
  };

  useEffect(() => {
    pubnub.addListener({ objects: handleObject });
    command();
  }, []);

  return [user, error];
};
