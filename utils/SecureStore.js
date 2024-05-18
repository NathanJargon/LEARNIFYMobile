import * as SecureStore from "expo-secure-store";

function setSecureStore(key, value) {
  const keyExist = getSecureStore(key);

  if (keyExist) removeSecureStore(key);
  SecureStore.setItem(key, value);
}

function getSecureStore(key) {
  let result = SecureStore.getItem(key);
  return result ? result : null;
}

async function removeSecureStore(key) {
  const keyExist = getSecureStore(key);

  if (keyExist) await SecureStore.deleteItemAsync(key);
}

export { getSecureStore, setSecureStore, removeSecureStore };
