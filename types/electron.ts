import { Item } from "./item";

declare global {
  interface Window {
    electronAPI?: {
      // windows api control
      controlWindow: (action: "minimize" | "maximize" | "close") => void;
      saveProducts: (items: Item[]) => Promise<void>;
      loadProducts: () => Promise<Item[]>;
      savePasscode: (code: string) => Promise<void>;
      loadPasscode: () => Promise<string | null>;
    };
  }
}
