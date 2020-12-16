import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import {
  CurrentChannelTypingIndicatorAtom,
  ThemeAtom,
  TypingIndicatorTimeoutAtom,
  UsersMetaAtom,
} from "../state-atoms";
import "./typing-indicator.scss";

export interface TypingIndicatorProps {
  // showAsMessage?: boolean;
}

export const TypingIndicator: FC<TypingIndicatorProps> = (props: TypingIndicatorProps) => {
  const theme = useRecoilValue(ThemeAtom);
  const users = useRecoilValue(UsersMetaAtom);
  const typingIndicators = useRecoilValue(CurrentChannelTypingIndicatorAtom);
  const typingIndicatorTimeout = useRecoilValue(TypingIndicatorTimeoutAtom);

  const getIndicationString = () => {
    const ids = Object.keys(typingIndicators).filter((id) => {
      return Date.now() - parseInt(typingIndicators[id]) / 10000 < typingIndicatorTimeout * 1000;
    });
    let indicateStr = "";
    if (ids.length > 1) indicateStr = "Multiple users are typing...";
    if (ids.length == 1) {
      const user = users.find((u) => u.id === ids[0]);
      indicateStr = `${user?.name || "Unknown User"} is typing...`;
    }
    return indicateStr;
  };

  return (
    <div className={`pn-typing-indicator pn-typing-indicator--${theme}`}>
      {getIndicationString()}&nbsp;
    </div>
  );
};

TypingIndicator.defaultProps = {
  showAsMessage: false,
};
