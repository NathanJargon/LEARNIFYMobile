import * as SecureStore from "expo-secure-store";

async function setSecureStore(key, value) {
  const keyExist = await getSecureStore(key);

  if (keyExist) await removeSecureStore(key);
  await SecureStore.setItemAsync(key, value);
}

async function getSecureStore(key) {
  let result = await SecureStore.getItemAsync(key);
  return result ? result : null;
}

async function removeSecureStore(key) {
  const keyExist = await getSecureStore(key);

  if (keyExist) await SecureStore.deleteItemAsync(key);
}

export { getSecureStore, setSecureStore, removeSecureStore };