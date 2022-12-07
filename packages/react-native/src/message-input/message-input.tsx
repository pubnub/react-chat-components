import React, { FC } from "react";
import { View, Image, TouchableOpacity, TextInput, Animated } from "react-native";
import {
  CommonMessageInputProps,
  useMessageInputCore,
  Icons,
} from "@pubnub/common-chat-components";
import { getDocumentAsync } from "expo-document-picker";
import { useStyle, useRotation } from "../helpers";
import createDefaultStyle, { MessageInputStyle } from "./message-input.style";
import AirplaneIcon from "../icons/airplane.png";
import AirplaneActiveIcon from "../icons/airplaneActive.png";
import SpinnerIcon from "../icons/spinnerActive.png";
import { SvgXml } from "react-native-svg";

export type MessageInputProps = CommonMessageInputProps & {
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: MessageInputStyle;
};

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const { handleInputChange, isValidInputText, loader, sendMessage, text, theme, setFile } =
    useMessageInputCore(props);
  const style = useStyle<MessageInputStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });
  const rotate = useRotation(loader);

  const pickDocument = async () => {
    try {
      const result = await getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.type === "cancel") {
        return;
      }
      console.log("result", result);
      setFile({ mimeType: result.mimeType, name: result.name, uri: result.uri });
    } catch (e) {
      console.log("error", e);
    }
    //   .then((response) => {
    //   if (response.type == "success") {
    //     const { name, size, uri } = response;
    //     const nameParts = name.split(".");
    //     const fileType = nameParts[nameParts.length - 1];
    //     const fileToUpload = {
    //       name: name,
    //       size: size,
    //       uri: uri,
    //       type: "application/" + fileType,
    //     };
    //     console.log(fileToUpload, "...............file");
    //     setDoc(fileToUpload);
    //   }
    // });
    // console.log(result);
  };

  /*
  /* Renderers
  */

  const renderSendButton = () => {
    return (
      <TouchableOpacity onPress={sendMessage} testID="message-input-send">
        {props.sendButton ? (
          props.sendButton
        ) : isValidInputText() ? (
          <Image style={style.icon} source={{ uri: AirplaneActiveIcon }} />
        ) : (
          <Image style={style.icon} source={{ uri: AirplaneIcon }} />
        )}
      </TouchableOpacity>
    );
  };

  const renderFileUpload = () => {
    return (
      <>
        <View>
          <TouchableOpacity style={style.messageInputFileLabel} onPress={pickDocument}>
            {props.fileUpload === "image" ? (
              <SvgXml xml={Icons.ImageIcon} width="100%" height="100%" />
            ) : (
              <SvgXml xml={Icons.FileIcon} width="100%" height="100%" />
            )}
          </TouchableOpacity>
        </View>
        {/*{file && (*/}
        {/*  <div title="Remove the file" onClick={handleRemoveFile}>*/}
        {/*    <XCircleIcon />*/}
        {/*  </div>*/}
        {/*)}*/}
      </>
    );
  };
  console.log("Icons.ImageIcon!!! :))", Icons);

  return (
    <View style={style.messageInputWrapper}>
      {!props.disabled && props.fileUpload && renderFileUpload()}
      {props.extraActionsRenderer && (
        <View style={style.extraActions}>{props.extraActionsRenderer()}</View>
      )}
      <TextInput
        testID="message-input"
        autoComplete="off"
        multiline={true}
        onChangeText={handleInputChange}
        placeholder={props.placeholder}
        style={style.messageInput}
        placeholderTextColor={style.messageInputPlaceholder.color}
        editable={!props.disabled}
        value={text}
      />
      {!props.disabled && (
        <View style={style.sendButton}>
          {loader ? (
            <Animated.Image
              style={[style.icon, { transform: [{ rotate }] }]}
              source={{ uri: SpinnerIcon }}
            />
          ) : (
            renderSendButton()
          )}
        </View>
      )}
    </View>
  );
};

MessageInput.defaultProps = {
  disabled: false,
  fileUpload: undefined,
  hideSendButton: false,
  placeholder: "Send message",
  senderInfo: false,
  typingIndicator: false,
};
