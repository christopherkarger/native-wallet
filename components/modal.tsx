import { BlurView } from "expo-blur";
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
        <BlurView intensity={80} tint="dark" style={styles.blurView}>
          <View style={styles.inner}>{props.children}</View>
          <TouchableOpacity
            style={styles.bg}
            onPress={props.onOutsideClick}
          ></TouchableOpacity>
        </BlurView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 999,
    height: Dimensions.get("screen").height,
    justifyContent: "center",
  },
  bg: {
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
