import { create } from "zustand";
import { setSecureStore, removeSecureStore } from "../utils/SecureStore";

const useStore = create((set) => ({
  userIsAuthenticated: false,
  signIn: (value) => {
    setSecureStore("userToken", value);
    set({ userIsAuthenticated: true });
  },
  signOut: async () => {
    removeSecureStore("userToken");
    set({ userIsAuthenticated: false });
  },
}));

export default useStore;