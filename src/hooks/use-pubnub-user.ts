import { useState, useEffect } from "react";
import { UserData, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";

export const usePubNubUser = (
  options: GetAllMetadataParameters = {},
  onError = (e) => console.error(e)
): UserData => {
  const pubnub = usePubNub();
  const [user, setUser] = useState(null);

  const command = async (): Promise<UserData> => {
    try {
      const response = await pubnub.objects.getUUIDMetadata(options);
      setUser(response.data);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    command();
  }, []);

  return user;
};
