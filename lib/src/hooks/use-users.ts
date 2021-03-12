import { useState, useEffect } from "react";
import { ObjectCustom, UUIDMetadataObject, GetAllMetadataParameters } from "pubnub";
import { usePubNub } from "pubnub-react";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";

type HookReturnValue = [UUIDMetadataObject<ObjectCustom>[], () => Promise<void>, number, Error];

export const useUsers = (options: GetAllMetadataParameters = {}): HookReturnValue => {
  const pubnub = usePubNub();

  const [users, setUsers] = useState<UUIDMetadataObject<ObjectCustom>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState("");
  const [error, setError] = useState<Error>();

  const paginatedOptions = merge({}, options, {
    page: { next: page },
    include: { totalCount: true },
  }) as GetAllMetadataParameters;

  const command = async () => {
    try {
      if (totalCount && users.length >= totalCount) return;
      const response = await pubnub.objects.getAllUUIDMetadata(paginatedOptions);
      setUsers((users) => [...users, ...response.data]);
      setTotalCount(response.totalCount);
      setPage(response.next);
    } catch (e) {
      setError(e);
    }
  };

  const handleObject = (event) => {
    const message = event.message;
    if (message.type !== "uuid") return;

    setUsers((users) => {
      const usersCopy = cloneDeep(users);
      const user = usersCopy.find((u) => u.id === message.data.id);

      // Set events are only handled for already fetched users in order to conform to filters and pagination
      if (user && message.event === "set") {
        Object.assign(user, message.data);
      }

      if (user && message.event === "delete") {
        usersCopy.splice(usersCopy.indexOf(user), 1);
      }

      return usersCopy;
    });
  };

  useEffect(() => {
    pubnub.addListener({ objects: handleObject });
    command();
  }, []);

  return [users, command, totalCount, error];
};
