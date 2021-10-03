import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, BackHandler, StyleSheet } from "react-native";
import GradientView from "./gradient-view";
import SafeArea from "./safe-area";

const ApiNotSupported = (props) => {
  return (
    <GradientView>
      <SafeArea style={styles.container}>
        <StatusBar style={props.statusBarStyle} />
        {Alert.alert(
          "",
          "Deine Version der App schein veraltet zu sein, bitte update sie im App Store.",
          [
            {
              text: "OK",
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: false }
        )}
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ApiNotSupported;
