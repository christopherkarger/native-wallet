import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "~/constants";
import Modal from "./modal";
import AppText from "./text";

const AlertModal = (props: {
  show: boolean;
  headline: string;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelText?: string;
  highlightButton?: number;
  subHeadline?: string;
  confirmText?: string;
}) => {
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
              <AppText
                style={[
                  styles.button,
                  styles.text,
                  props.highlightButton === 1 ||
                  props.highlightButton === undefined
                    ? styles.highlight
                    : {},
                  styles.confirm,
                ]}
              >
                {props.confirmText}
              </AppText>
            </TouchableOpacity>
          )}
          {!!props.cancelText && (
            <TouchableOpacity
              onPress={() => {
                if (props.onCancel) {
                  props.onCancel();
                }
              }}
            >
              <AppText
                style={[
                  styles.button,
                  styles.text,
                  props.highlightButton === 2 ? styles.highlight : {},
                  styles.cancel,
                ]}
              >
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
  button: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 15,
  },
  highlight: {
    backgroundColor: Colors.lightBlue,
    color: Colors.white,
  },
  confirm: {},
  cancel: {},
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
