import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Easing,
  LayoutChangeEvent,
  SafeAreaView,
  Platform,
} from "react-native";
import CloseIcon from "../icons/close-icon.png";
import FileIcon from "../icons/file.png";
import ImageIcon from "../icons/image.png";
import { MessageInputStyle } from "./message-input.style";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type FilePlacePickerModalProps = {
  modalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  pickPhoto: () => void;
  pickDocument: () => void;
  style?: MessageInputStyle;
};

const OPACITY_ANIMATION_IN_TIME = 225;
const OPACITY_ANIMATION_OUT_TIME = 195;
const EASING_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASING_IN = Easing.out(EASING_OUT);

export const FileModal = ({
  modalVisible,
  setModalVisible,
  pickPhoto,
  pickDocument,
  style,
}: FilePlacePickerModalProps) => {
  const [modalShown, setModalShown] = useState(false);
  const [sheetOpacity] = useState(new Animated.Value(0));
  const [actionSheetHeight, setActionSheetHeight] = useState(360);

  const _setActionSheetHeight = ({ nativeEvent }: LayoutChangeEvent) => {
    setActionSheetHeight(nativeEvent.layout.height);
  };

  useEffect(() => {
    if (modalVisible) {
      setModalShown(true);
      sheetOpacity.setValue(0);

      Animated.timing(sheetOpacity, {
        toValue: 1,
        easing: EASING_OUT,
        duration: OPACITY_ANIMATION_IN_TIME,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sheetOpacity, {
        toValue: 0,
        easing: EASING_IN,
        duration: OPACITY_ANIMATION_OUT_TIME,
        useNativeDriver: true,
      }).start((result) => {
        if (result.finished) {
          setModalShown(false);
        }
      });
    }
  }, [modalVisible, sheetOpacity]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={modalShown}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      testID="message-input-file-modal-container"
    >
      <Pressable
        onPress={() => {
          setModalVisible(false);
        }}
        style={style.fileUploadModalContent}
      >
        <AnimatedSafeAreaView
          style={[
            style.fileUploadModalSheetContainer,
            {
              opacity: sheetOpacity,
              transform: [
                {
                  translateY: sheetOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [actionSheetHeight, Platform.OS === "ios" ? -84 : -54],
                  }),
                },
              ],
            },
          ]}
        >
          <View onLayout={_setActionSheetHeight} style={style.fileUploadModalSheetContent}>
            <View style={style.fileUploadModalSheetContentHeaderContainer}>
              <Text style={style.fileUploadModalSheetContentHeaderText}>Add attachment</Text>
              <TouchableOpacity
                style={style.fileUploadModalSheetContentCloseIconContainer}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Image
                  source={{ uri: CloseIcon }}
                  style={style.fileUploadModalSheetContentCloseIcon}
                />
              </TouchableOpacity>
            </View>
            <Pressable style={style.fileUploadModalSheetContentButton} onPress={pickPhoto}>
              <Image
                source={{ uri: ImageIcon }}
                style={style.fileUploadModalSheetContentButtonIcon}
              />
              <Text style={style.fileUploadModalSheetContentTextStyle}>Photos</Text>
            </Pressable>
            <Pressable
              style={style.fileUploadModalSheetContentButton}
              onPress={pickDocument}
              testID="message-input-pick-document-option"
            >
              <Image
                source={{ uri: FileIcon }}
                style={style.fileUploadModalSheetContentButtonIcon}
              />
              <Text style={style.fileUploadModalSheetContentTextStyle}>Documents</Text>
            </Pressable>
          </View>
        </AnimatedSafeAreaView>
      </Pressable>
    </Modal>
  );
};
