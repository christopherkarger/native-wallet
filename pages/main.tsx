import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "~/constants";
import { createLocalDBTableWallets } from "~/db";
import { createLocalDBTableMarket } from "~/db/market";
import AddWalletScreen from "./add-wallet";
import Overview from "./overview";
import Settings from "./settings";

const Tab = createBottomTabNavigator();

createLocalDBTableMarket().catch((err) => {
  console.log(err);
  console.warn("Local DB Table market could no be created");
});

createLocalDBTableWallets().catch((err) => {
  console.log(err);
  console.warn("Local DB Table wallets could no be created");
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
    <NavigationContainer theme={AppTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingTop: 3,
            paddingBottom: 5,
            height: 45,
            backgroundColor: Colors.bgDark,
            borderTopWidth: 1,
            borderTopColor: Colors.darkBlue,
          },
          tabBarActiveTintColor: Colors.lightBlue,
          tabBarInactiveTintColor: Colors.white,
        }}
      >
        <Tab.Screen
          name="overview"
          component={Overview}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="account-balance-wallet"
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="addWallet"
          component={AddWalletScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <LinearGradient
                style={styles.addWalletButtonGradient}
                colors={[
                  focused ? color : Colors.lightBlue,
                  focused ? color : Colors.purple,
                ]}
              >
                <MaterialIcons
                  name="add"
                  size={25}
                  color={focused ? Colors.darkBlue : Colors.white}
                />
              </LinearGradient>
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  addWalletButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Main;
