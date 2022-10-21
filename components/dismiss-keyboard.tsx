import React, { ReactNode } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const DismissKeyboard = (props: { children: ReactNode }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {props.children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
