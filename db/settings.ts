import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupportedCurrencies, SupportedLanguages } from "~/models/context";

export const saveSettingsActiveLanguage = async (
  language: SupportedLanguages
) => {
  try {
    await AsyncStorage.setItem("@settings_language", language);
  } catch (err) {
    console.error(err);
  }
};

export const saveSettingsActiveCurrency = async (
  currency: SupportedCurrencies
) => {
  try {
    await AsyncStorage.setItem("@settings_currency", currency);
  } catch (err) {
    console.error(err);
  }
};

export const getSettings = async () => {
  try {
    const activeLanguage = await AsyncStorage.getItem("@settings_language");
    const activeCurrency = await AsyncStorage.getItem("@settings_currency");
    if (activeLanguage && activeCurrency) {
      return {
        activeLanguage,
        activeCurrency,
      };
    }
  } catch (err) {
    console.error(err);
  }
};
