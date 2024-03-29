import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import {
  resetLocalDbWallets,
  saveSettingsActiveCurrency,
  saveSettingsActiveLanguage,
  selectLocalDBTableWallets,
} from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  SupportedCurrencies,
  SupportedLanguages,
} from "~/models/context";
import { INavigation } from "~/models/models";
import { switchNumeralLocal } from "~/services/format-number";
import { waitTime } from "~/services/helper";
import { Texts } from "~/texts";
import Toggle from "../components/toggle";

const SettingsScreen = (props: { navigation: INavigation }) => {
  const [activeLanguage, setActiveLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency, setActiveCurrency] = useContext(ActiveCurrencyContext);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const isFocused = useIsFocused();
  const mounted = useIsMounted();

  const deleteDemo = useCallback(async () => {
    try {
      await resetLocalDbWallets();
      DeviceEventEmitter.emit(
        UPDATE_WALLETS_EVENT,
        UPDATE_WALLETS_EVENT_TYPE.Delete
      );
      // Wait till homescreen updates the wallets to avoid wallets flash
      await waitTime(100);
      props.navigation.navigate(PathNames.homeTab);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const changeLanguage = useCallback(
    (language: SupportedLanguages) => {
      setActiveLanguage(language);
      switchNumeralLocal(language);
      saveSettingsActiveLanguage(language);
    },
    [activeLanguage]
  );

  const changeCurrency = useCallback(
    (currency: SupportedCurrencies) => {
      setActiveCurrency(currency);
      saveSettingsActiveCurrency(currency);
    },
    [activeCurrency]
  );

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    (async () => {
      const localWallets = await selectLocalDBTableWallets().catch(() => {});

      if (mounted.current) {
        if (localWallets && localWallets.rows.length) {
          setIsDemoAccount(
            localWallets.rows._array.some((x) => x.isDemoAddress)
          );
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
            <Toggle
              text={["De", "En"]}
              active={[
                activeLanguage === SupportedLanguages.DE,
                activeLanguage === SupportedLanguages.EN,
              ]}
              toggle={(index: number) => {
                if (index === 0) {
                  changeLanguage(SupportedLanguages.DE);
                }

                if (index === 1) {
                  changeLanguage(SupportedLanguages.EN);
                }
              }}
            ></Toggle>
          </View>

          <View style={styles.item}>
            <AppText style={styles.itemHeadline}>
              {Texts.currency[activeLanguage]}
            </AppText>
            <Toggle
              text={["US-Dollar", "Euro"]}
              active={[
                activeCurrency === SupportedCurrencies.USD,
                activeCurrency === SupportedCurrencies.EUR,
              ]}
              toggle={(index: number) => {
                changeCurrency(
                  index === 0
                    ? SupportedCurrencies.USD
                    : SupportedCurrencies.EUR
                );
              }}
            ></Toggle>
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
  item: {
    marginBottom: 30,
  },
  itemHeadline: {
    marginBottom: 10,
  },
});

export default SettingsScreen;
