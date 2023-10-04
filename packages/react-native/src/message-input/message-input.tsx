import React, { FC, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  TextInputProps,
  Text,
} from "react-native";
import { CommonMessageInputProps, useMessageInputCore } from "@pubnub/common-chat-components";
import { getDocumentAsync } from "expo-document-picker";
import { useStyle, useRotation } from "../helpers";
import createDefaultStyle, { MessageInputStyle } from "./message-input.style";
import AirplaneIcon from "../icons/airplane.png";
import AirplaneActiveIcon from "../icons/airplaneActive.png";
import SpinnerIcon from "../icons/spinnerActive.png";
import FileIcon from "../icons/file.png";
import ImageIcon from "../icons/image.png";
import XCircleIcon from "../icons/x-circle.png";
import * as ImagePicker from "expo-image-picker";
import { FileModal } from "./file-modal";
import { NativeSyntheticEvent } from "react-native/Libraries/Types/CoreEventTypes";
import { TextInputKeyPressEventData } from "react-native/Libraries/Components/TextInput/TextInput";

export type MessageInputProps = CommonMessageInputProps & {
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: MessageInputStyle;
  fileModalRenderer?: (params: {
    pickPhoto: () => Promise<void>;
    pickDocument: () => Promise<void>;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  }) => JSX.Element;
  onChange?: (newText: string) => void;
  sendMessageOnSubmitEditing?: boolean;
} & Omit<
    TextInputProps,
    | "testID"
    | "autoComplete"
    | "multiline"
    | "onChangeText"
    | "placeholder"
    | "style"
    | "placeholderTextColor"
    | "editable"
    | "value"
  >;

/**
 * Allows users to compose messages using text and emojis
 * and automatically publish them on PubNub channels upon sending.
 */
export const MessageInput: FC<MessageInputProps> = (props: MessageInputProps) => {
  const {
    actionsAfterInput,
    disabled,
    draftMessage,
    extraActionsRenderer,
    fileModalRenderer,
    fileUpload,
    onBeforeSend,
    onChange,
    onKeyPress,
    onSend,
    placeholder,
    sendButton,
    sendMessageOnSubmitEditing,
    senderInfo,
    typingIndicator,
    filePreviewRenderer,
    ...otherTextInputProps
  } = props;

  const {
    startTypingIndicator,
    stopTypingIndicator,
    isValidInputText,
    loader,
    sendMessage,
    text,
    theme,
    setFile,
    file,
    setText,
    onError,
  } = useMessageInputCore({ draftMessage, senderInfo, onSend, onBeforeSend, typingIndicator });

  const style = useStyle<MessageInputStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });
  const rotate = useRotation(loader);
  const [modalVisible, setModalVisible] = useState(false);

  const pickPhoto = async () => {
    try {
      const permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionStatus.granted) {
        onError({
          message: "MediaLibraryPermission is not granted",
          name: "MediaLibraryPermission",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      setModalVisible(false);
      const fileName =
        asset.fileName || asset.uri.substring(asset.uri.lastIndexOf("/") + 1, asset.uri.length);
      setFile({ mimeType: "image/*", name: fileName, uri: asset.uri });
    } catch (e) {
      onError(e);
    }
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
    } catch (e) {
      onError(e);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleInputChange = (newText: string) => {
    try {
      if (typingIndicator) {
        newText.length ? startTypingIndicator() : stopTypingIndicator();
      }
      onChange && onChange(newText);
      setText(newText);
    } catch (e) {
      onError(e);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    onKeyPress && onKeyPress(e);

    if (e.nativeEvent.key == "Enter" && sendMessageOnSubmitEditing) {
      sendMessage();
    }
  };

  /*
  /* Renderers
  */

  const renderSendButton = () => {
    return (
      <TouchableOpacity onPress={sendMessage} testID="message-input-send">
        {sendButton ? (
          sendButton
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
        {file ? (
          <TouchableOpacity style={style.messageInputRemoveFileLabel} onPress={handleRemoveFile}>
            <Image source={{ uri: XCircleIcon }} style={style.icon} />
          </TouchableOpacity>
        ) : (
          <View>
            <>
              {fileUpload === "image" ? (
                <TouchableOpacity
                  style={style.messageInputFileLabel}
                  onPress={pickPhoto}
                  testID="message-input-photo-icon-container"
                >
                  <Image source={{ uri: ImageIcon }} style={style.icon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={style.messageInputFileLabel}
                  onPress={() => setModalVisible(true)}
                  testID="message-input-file-icon-container"
                >
                  <Image source={{ uri: FileIcon }} style={style.icon} />
                </TouchableOpacity>
              )}
            </>
          </View>
        )}
      </>
    );
  };

  const renderFileModal = () => {
    if (fileModalRenderer) {
      return fileModalRenderer({ pickDocument, pickPhoto, modalVisible, setModalVisible });
    }

    return (
      <FileModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pickPhoto={pickPhoto}
        pickDocument={pickDocument}
        style={style}
      />
    );
  };

  const renderActions = () => (
    <>
      {!disabled && fileUpload && renderFileUpload()}
      {extraActionsRenderer && <View style={style.extraActions}>{extraActionsRenderer()}</View>}
    </>
  );

  const renderFilePreview = () => {
    if (filePreviewRenderer) {
      return filePreviewRenderer(file);
    }

    if (!file) {
      return null;
    }

    return (
      <View style={style.filePreviewContainer}>
        <Text style={style.filePreviewText}>{file.name}</Text>
      </View>
    );
  };

  return (
    <View style={style.messageInputWrapper}>
      {renderFilePreview()}
      <View style={style.messageInputContent}>
        {renderFileModal()}
        {!actionsAfterInput && renderActions()}
        <TextInput
          {...otherTextInputProps}
          testID="message-input"
          autoComplete="off"
          multiline={true}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          style={style.messageInput}
          placeholderTextColor={style.messageInputPlaceholder.color}
          editable={!disabled}
          value={text}
          onKeyPress={handleKeyPress}
        />
        {actionsAfterInput && renderActions()}
        {!disabled && (
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
    </View>
  );
};

MessageInput.defaultProps = {
  disabled: false,
  fileUpload: undefined,
  placeholder: "Send message",
  senderInfo: false,
  typingIndicator: false,
};
