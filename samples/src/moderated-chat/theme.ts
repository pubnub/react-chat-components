import { createContext, Dispatch, SetStateAction } from "react";
import { Themes } from "@pubnub/react-chat-components";

export const ThemeContext = createContext<{ value: Themes; set: Dispatch<SetStateAction<Themes>> }>(
  {
    value: "light",
    set: () => {},
  }
);
