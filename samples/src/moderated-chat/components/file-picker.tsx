import { usePubNub } from "pubnub-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme";
import { TextField } from "@pubnub/react-chat-components";
import { ModalConsumerProps } from "./modal-provider";
import { Picker } from "emoji-mart";
import "./file-picker.scss";

export function FileUpload({
  file,
  setModalState,
  channel,
}: {
  file: File;
  setModalState: (state: boolean) => void;
  channel: string;
}) {
  const pubnub = usePubNub();
  const [image, setImage] = useState("");
  const { value: theme } = useContext(ThemeContext);
  const [text, setText] = useState("");
  // read the file to a data URL
  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // this is safe because we only use readAsDataURL
        const dataURL = e.target?.result as string;
        setImage(dataURL);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const e = Math.floor(Math.log(file.size) / Math.log(1024));
  const size = (file.size / Math.pow(1024, e)).toFixed(1) + " " + " KMGTP".charAt(e) + "B";

  const send = async () => {
    // currently not handling files too big
    await pubnub
      .sendFile({
        file,
        channel,
        message: { text: text.length > 0 ? text : undefined },
      })
      .catch(console.error);
    setModalState(false);
    setText("");
  };

  return (
    <div className="file-preview">
      <img src={image} alt="file preview" />
      <div className="filename">
        {file.name} ({size})
      </div>
      <div className="description">
        Description <span>(optional)</span>
      </div>
      <TextField
        emojiPicker={<Picker />}
        theme={theme}
        text={text}
        onChange={setText}
        onSubmit={send}
        hideSendButton
        placeholder=""
      />
      <div className="modal_actions">
        <button
          onClick={() => {
            setModalState(false);
            setText("");
          }}
        >
          Cancel
        </button>
        <button className="cta" onClick={send}>
          Upload
        </button>
      </div>
    </div>
  );
}

export function FilePickerButton({
  id,
  channel,
  setModalState,
  setModalContent,
}: { id: string; channel: string } & ModalConsumerProps) {
  const showModal: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setModalState(true);
    setModalContent(
      <FileUpload
        file={(e.target?.files || [])[0]}
        channel={channel}
        setModalState={setModalState}
      />
    );
  };
  return (
    <div className="file-picker">
      <label htmlFor={`${id}_file`}>+</label>
      <input type="file" id={`${id}_file`} name="file" onChange={showModal}></input>
    </div>
  );
}
