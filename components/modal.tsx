import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Keyboard,
  Modal as ExpoModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Modal = (props) => {
  useEffect(() => {
    Keyboard.dismiss();
  }, [props.show]);

  return (
    <>
      <ExpoModal
        animationType="slide"
        transparent={true}
        visible={props.show}
        onRequestClose={() => props.onClose()}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, props.style]}>{props.children}</View>
          <TouchableOpacity
            style={styles.blurButton}
            onPress={props.onClose}
          ></TouchableOpacity>
        </View>
      </ExpoModal>
      {props.show && (
        <BlurView intensity={80} tint="dark" style={styles.blurView}></BlurView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    overflow: "hidden",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
  blurButton: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    flex: 1,
  },
});

export default Modal;
