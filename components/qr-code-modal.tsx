import React from "react";
import { StyleSheet, View } from "react-native";
import SvgQRCode from "react-native-qrcode-svg";
import { Colors } from "~/constants";
import Modal from "./modal";

const QrCodeModal = (props: {
  show: boolean;
  onClose: () => void;
  address: string;
}) => {
  return (
    <Modal show={props.show} onClose={() => props.onClose()}>
      <View style={styles.codeWrapper}>
        <SvgQRCode value={props.address} size={200} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
  },
  codeWrapper: {
    alignItems: "center",
    padding: 20,
  },
});
export default QrCodeModal;
