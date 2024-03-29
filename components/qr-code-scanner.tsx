import { MaterialIcons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, PathNames } from "~/constants";
import { INavigation } from "~/models/models";
import SafeArea from "./safe-area";

const QrCodeScanner = (props: {
  navigation: INavigation;
  disabled?: boolean;
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      const isGranted = status === "granted";
      if (isGranted) {
        setHasPermission(true);
      } else {
        props.navigation.goBack();
      }
    })();
  }, []);

  const handleBarCodeScanned = (barcodeProps: { data: string }) => {
    if (barcodeProps.data) {
      setScanned(true);
      props.navigation.navigate(PathNames.addWallet, {
        address: barcodeProps.data,
      });
    }
  };

  return (
    <View style={styles.container}>
      {hasPermission && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFill, styles.scanner]}
        >
          <SafeArea>
            <View style={styles.overlay}></View>
            <TouchableOpacity
              style={styles.closeButton}
              disabled={props.disabled}
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <MaterialIcons name="close" size={40} color="white" />
            </TouchableOpacity>
          </SafeArea>
        </BarCodeScanner>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
  },
  overlay: {
    position: "absolute",
    top: "30%",
    left: "15%",
    width: "70%",
    height: "40%",
    borderWidth: 3,
    borderColor: Colors.white,
    zIndex: 100,
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scanner: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flexDirection: "column",
  },
});

export default QrCodeScanner;
