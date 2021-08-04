import { ThemeContext } from "../theme";
import { Themes } from "@pubnub/react-chat-components";
import React, { useState } from "react";
import "./modal-provider.scss";

export interface ModalConsumerProps {
  setModalState: (state: boolean) => void;
  setModalContent: (content: JSX.Element) => void;
}

export const ModalProvider: React.FC<{
  renderChildren: (modal: ModalConsumerProps) => JSX.Element;
}> = ({ renderChildren }) => {
  const [modalState, setModalState] = useState(false);
  const [theme, setTheme] = useState<Themes>("light");
  const [modalContent, setModalContent] = useState(<div></div>);
  return (
    <div className={`app`}>
      <ThemeContext.Provider value={{ value: theme, set: setTheme }}>
        <div className={`modal ${modalState ? "shown" : ""} ${theme}`}>
          <div className="modal_content-area">{modalContent}</div>
        </div>
        {renderChildren({ setModalState, setModalContent })}
      </ThemeContext.Provider>
    </div>
  );
};
