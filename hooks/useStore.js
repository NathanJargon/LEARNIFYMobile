import { create } from "zustand";
import { setSecureStore, removeSecureStore } from "../utils/SecureStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set) => ({
  userIsAuthenticated: false,
  signIn: (value) => {
    setSecureStore("userToken", value);
    set({ userIsAuthenticated: true });
  },
  signOut: async () => {
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('password');
    removeSecureStore("userToken");
    set({ userIsAuthenticated: false });
  },
}));

export default useStore;