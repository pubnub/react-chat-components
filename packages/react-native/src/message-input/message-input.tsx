import React, { FC, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { FilePlacePickerModal } from "./file-place-picker-modal";

export type MessageInputProps = CommonMessageInputProps & {
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: MessageInputStyle;
};

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const {
    handleInputChange,
    isValidInputText,
    loader,
    sendMessage,
    text,
    theme,
    setFile,
    file,
    setText,
  } = useMessageInputCore(props);
  const style = useStyle<MessageInputStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });
  const rotate = useRotation(loader);
  const [modalVisible, setModalVisible] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    const asset = result.assets[0];

    setModalVisible(false);
    setFile({ mimeType: "image/*", name: asset.fileName, uri: asset.uri });
    setText(asset.fileName);
  };

  const pickDocument = async () => {
    try {
      const result = await getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.type === "cancel") {
        return;
      }
      setModalVisible(false);
      setFile({ mimeType: result.mimeType, name: result.name, uri: result.uri });
      setText(result.name);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
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
          <>
            {props.fileUpload === "image" ? (
              <TouchableOpacity style={style.messageInputFileLabel} onPress={pickPhoto}>
                <SvgXml xml={Icons.ImageIcon} width="100%" height="100%" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={style.messageInputFileLabel}
                onPress={() => setModalVisible(true)}
              >
                <SvgXml xml={Icons.FileIcon} width="100%" height="100%" />
              </TouchableOpacity>
            )}
          </>
        </View>
        {file && (
          <TouchableOpacity style={style.messageInputRemoveFileLabel} onPress={handleRemoveFile}>
            <SvgXml xml={Icons.XCircleIcon} width="100%" height="100%" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={style.messageInputWrapper}>
      <FilePlacePickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pickPhoto={pickPhoto}
        pickDocument={pickDocument}
      />
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
