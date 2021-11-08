import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "~/constants";
import Modal from "./modal";
import AppText from "./text";
const QrCodeModal = (props) => {
  return (
    <Modal show={props.show} onClose={() => props.onClose()}>
      <AppText style={styles.text}>{props.address}</AppText>
    </Modal>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
  },
});
export default QrCodeModal;
