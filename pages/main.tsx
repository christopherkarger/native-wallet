import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import GradientView from "~/components/gradient-view";
import QrCodeScanner from "~/components/qr-code-scanner";
import { createLocalDBTable } from "~/db";
import { Colors, PathNames } from "../constants";
import AddWalletScreen from "./add-wallet";
import HomeScreen from "./home-screen";
import SingleWallet from "./single-wallet";

const Stack = createNativeStackNavigator();

createLocalDBTable().catch((err) => {
  console.log(err);
  console.warn("Local DB could no be created");
});

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.transparent,
  },
};

const Main = () => {
  return (
    <GradientView>
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
          <Stack.Screen
            name={PathNames.singleWallet}
            component={SingleWallet}
          />
          <Stack.Screen name={PathNames.scanCode} component={QrCodeScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </GradientView>
  );
};

export default Main;
