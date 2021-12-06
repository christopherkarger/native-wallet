import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAddressUpdate = async (date: number, count: number) => {
  try {
    await AsyncStorage.setItem("@address_update_date", `${date}`);
    await AsyncStorage.setItem("@address_update_count", `${count}`);
  } catch (err) {
    console.error(err);
  }
};

export const getAddressUpdate = async () => {
  try {
    const date = await AsyncStorage.getItem("@address_update_date");
    const count = await AsyncStorage.getItem("@address_update_count");
    if (date === null || count === null) {
      return;
    }
    return {
      date: +date,
      count: +count,
    };
  } catch (err) {
    console.error(err);
  }
};
