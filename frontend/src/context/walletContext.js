import { createContext } from "react";

export const WalletContext = createContext({
  balance: null,
  isConnected: false,
  isScholar: false,
});
