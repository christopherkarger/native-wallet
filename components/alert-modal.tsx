import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "~/constants";
import Modal from "./modal";
import AppText from "./text";

const AlertModal = (props) => {
  return (
    <Modal style={styles.modalWrapper} show={props.show} onClose={() => {}}>
      <View style={styles.inner}>
        {props.headline && (
          <AppText style={[styles.text, styles.headline]}>
            {props.headline}
          </AppText>
        )}
        {props.subHeadline && (
          <AppText style={[styles.text, styles.subHeadline]}>
            {props.subHeadline}
          </AppText>
        )}
        <View style={styles.buttonWrapper}>
          {!!props.confirmText && (
            <TouchableOpacity
              onPress={() => {
                props.onConfirm();
              }}
            >
              <AppText style={[styles.text, styles.confirm]}>
                {props.confirmText}
              </AppText>
            </TouchableOpacity>
          )}
          {!!props.cancelText && (
            <TouchableOpacity
              onPress={() => {
                props.onCancel();
              }}
            >
              <AppText style={[styles.text, styles.cancel]}>
                {props.cancelText}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inner: {
    padding: 14,
  },
  text: {
    color: Colors.text,
  },
  headline: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    marginBottom: 5,
  },
  subHeadline: {
    fontSize: 15,
  },
  confirm: {
    backgroundColor: Colors.lightBlue,
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 15,
  },
  cancel: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 15,
  },
  modalWrapper: {
    width: "80%",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default AlertModal;
