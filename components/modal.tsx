import React, { useEffect } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants";

const Modal = (props) => {
  useEffect(() => {
    Keyboard.dismiss();
  }, [props.show]);

  return (
    <>
      {props.show && (
        <View style={styles.wrapper}>
          <View style={styles.inner}>{props.children}</View>
          <TouchableOpacity
            style={styles.bg}
            onPress={props.onOutsideClick}
          ></TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    zIndex: 999,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  bg: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  inner: {
    backgroundColor: Colors.white,
    zIndex: 20,
    maxHeight: "40%",
    width: "80%",
    position: "relative",
    left: "10%",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Modal;
