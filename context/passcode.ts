import { create } from "zustand";
 
type PasscodeState = {
  status: "loading" | "unset" | "locked" | "unlocked";
  init: () => Promise<void>;
  verify: (code: string) => Promise<boolean>;
  setup: (code: string) => Promise<void>;
};
 
export const usePasscode = create<PasscodeState>((set) => ({
  status: "loading",
 
  init: async () => {
    const code = await window.electronAPI?.loadPasscode();
    if (!code) {
      set({ status: "unset" });
    } else {
      set({ status: "locked" });
    }
  },
 
  verify: async (code: string) => {
    const saved = await window.electronAPI?.loadPasscode();
    if (code === saved) {
      set({ status: "unlocked" });
      return true;
    }
    return false;
  },
 
  setup: async (code: string) => {
    await window.electronAPI?.savePasscode(code);
    set({ status: "unlocked" });
  },
}));