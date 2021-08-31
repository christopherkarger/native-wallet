import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, PathNames } from "../constants";
import AddWalletScreen from "./add-wallet";
import HomeScreen from "./home-screen";

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.transparent,
  },
};

const Main = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.fadeLight, Colors.transparent]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.areaView}>
        <NavigationContainer theme={AppTheme}>
          <Stack.Navigator
            initialRouteName={PathNames.home}
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name={PathNames.home} component={HomeScreen} />
            <Stack.Screen
              name={PathNames.addWallet}
              component={AddWalletScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  areaView: {
    flex: 1,
    paddingTop: 15,
  },
  gradient: {
    position: "absolute",
    left: "-100%",
    right: 0,
    top: "-160%",
    height: "200%",
    width: "400%",
    transform: [{ rotate: "40deg" }],
  },
});

export default Main;
