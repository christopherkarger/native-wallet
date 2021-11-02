import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import {
  resetLocalDbWallets,
  saveSettingsToLocalDBTableSettings,
  selectLocalDBTableWallets,
} from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { ActiveLanguage, SupportedLanguages } from "~/models/context";
import { switchNumeralLocal } from "~/services/format-number";
import { Texts } from "~/texts";

const SettingsScreen = (props) => {
  const [activeLanguage, setActiveLanguage] = useContext(ActiveLanguage);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const [isDeletingDemoAccount, setIsDeletingDemoAccount] = useState(false);
  const isFocused = useIsFocused();
  const mounted = useIsMounted();
  const deleteDemo = async () => {
    if (isDeletingDemoAccount) {
      return;
    }
    setIsDeletingDemoAccount(true);
    try {
      await resetLocalDbWallets();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingDemoAccount(false);
      DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);
      props.navigation.navigate(PathNames.homeTab);
    }
  };

  const changeLanguage = useCallback((language: SupportedLanguages) => {
    setActiveLanguage(language);
    switchNumeralLocal(language);
    saveSettingsToLocalDBTableSettings({
      activeLanguage: language,
    });
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    (async () => {
      const localWallets = await selectLocalDBTableWallets().catch(() => {});

      if (mounted.current) {
        if (localWallets && localWallets.rows.length) {
          setIsDemoAccount(localWallets.rows._array.some((x) => x.demoAddress));
        } else {
          setIsDemoAccount(false);
        }
      }
    })();
  }, [isFocused]);

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.settings[activeLanguage]}
        </SubPageHeader>
        <View style={styles.inner}>
          <View style={styles.item}>
            <AppText style={styles.itemHeadline}>
              {Texts.language[activeLanguage]}
            </AppText>
            <View style={styles.toggleWrapper}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  activeLanguage === SupportedLanguages.DE
                    ? styles.toggleButtonActive
                    : {},
                ]}
                onPress={() => changeLanguage(SupportedLanguages.DE)}
              >
                <AppText
                  style={[
                    styles.toggleButtonText,
                    activeLanguage === SupportedLanguages.DE
                      ? styles.toggleButtonActiveText
                      : {},
                  ]}
                >
                  De
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  activeLanguage === SupportedLanguages.EN
                    ? styles.toggleButtonActive
                    : {},
                ]}
                onPress={() => changeLanguage(SupportedLanguages.EN)}
              >
                <AppText
                  style={[
                    styles.toggleButtonText,
                    activeLanguage === SupportedLanguages.EN
                      ? styles.toggleButtonActiveText
                      : {},
                  ]}
                >
                  En
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {isDemoAccount && (
            <Button onPress={deleteDemo}>
              <AppText>{Texts.deleteDemo[activeLanguage]}</AppText>
            </Button>
          )}
        </View>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
    flex: 1,
  },
  toggleWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  toggleButtonText: {
    fontFamily: Fonts.bold,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleButtonActiveText: {
    color: Colors.bgDark,
  },
  item: {
    marginBottom: 30,
  },
  itemHeadline: {
    marginBottom: 10,
  },
});

export default SettingsScreen;
