import React from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

type FilePlacePickerModalProps = {
  modalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  pickPhoto: () => void;
  pickDocument: () => void;
};

export const FilePlacePickerModal = ({
  modalVisible,
  setModalVisible,
  pickPhoto,
  pickDocument,
}: FilePlacePickerModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={pickPhoto}>
            <Text style={styles.textStyle}>Pick photo</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={pickDocument}>
            <Text style={styles.textStyle}>Pick document</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
