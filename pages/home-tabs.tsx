import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import GradientView from "~/components/gradient-view";
import { Colors, PathNames } from "../constants";
import AddWalletScreen from "./add-wallet";
import HomeScreen from "./home-screen";
import Settings from "./settings";

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <GradientView>
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
          name={PathNames.homeTab}
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name="account-balance-wallet"
                size={25}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={PathNames.addWallet}
          component={AddWalletScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={[
                  styles.addWalletButtonGradient,
                  focused ? styles.addWalletButtonActive : {},
                ]}
              >
                <MaterialIcons
                  name="add"
                  size={25}
                  color={focused ? Colors.white : Colors.darkBlue}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={PathNames.settings}
          component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={25} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  addWalletButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  addWalletButtonActive: {
    // width: 22,
    // height: 22,
    backgroundColor: Colors.lightBlue,
  },
});

export default HomeTabs;
