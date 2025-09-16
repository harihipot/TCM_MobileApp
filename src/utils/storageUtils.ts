import AsyncStorage from "@react-native-async-storage/async-storage";
const AUTH_TOKEN = "AuthToken";

const _store = async (key: string, data: any) => {
  try {
    return await AsyncStorage.setItem(key, data);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const _get = async (key: string) => {
  try {
    //This was throwing error after plugin upgrade- RN UPGRADE
    return AsyncStorage.getItem(key, (data) => {
      return data;
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const _reset = async (key: string) => {
  let data = await _get(key);
  try {
    if (data) {
      await AsyncStorage.setItem(key, "");
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// auth token
export const storeAuthToken = async (token: string) => {
  return _store(AUTH_TOKEN, token);
};

export const getAuthToken = async () => {
  return _get(AUTH_TOKEN);
};

export const resetAuthToken = async () => {
  return _reset(AUTH_TOKEN);
};
