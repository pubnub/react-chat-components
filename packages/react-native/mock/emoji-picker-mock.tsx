import React from "react";
import { Modal, Text, Pressable } from "react-native";
import { EmojiPickerElementProps } from "../src/types";

export const Picker = (props: EmojiPickerElementProps): JSX.Element => {
  const emojis = ["🙂", "😄"];

  return props.open ? (
    <Modal>
      <Text>Emoji Picker</Text>
      {emojis.map((e) => (
        <Pressable onPress={() => props.onEmojiSelected({ emoji: e })} key={e}>
          <Text>{e}</Text>
        </Pressable>
      ))}
    </Modal>
  ) : null;
};
