import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import GradientView from "~/components/gradient-view";
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
        </Stack.Navigator>
      </NavigationContainer>
    </GradientView>
  );
};

export default Main;
