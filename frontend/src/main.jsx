import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mysten/dapp-kit/dist/index.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./route.jsx";
import { networkConfig } from "./config/networkConfig.js";
import { lightTheme } from "./themes/lightTeheme.js";

const queryClient = new QueryClient();
// const networks = {
//   devnet: { url: getFullnodeUrl("devnet") },
//   testnet: { url: getFullnodeUrl("testnet") },
//   mainnet: { url: getFullnodeUrl("mainnet") },
// };

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider
          autoConnect={true}
          theme={[
            {
              variables: lightTheme,
            },
          ]}
        >
          <RouterProvider router={router} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>
);
