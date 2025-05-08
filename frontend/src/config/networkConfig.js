import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_RELIGY_SYNC_PACKAGE_ID,
  TESTNET_RELIGY_SYNC_PACKAGE_ID,
  MAINNET_RELIGY_SYNC_PACKAGE_ID,
  DEVNET_PLATFORM_ID,
  TESTNET_PLATFORM_ID,
  DEVNET_ADMIN_CAP_ID,
  TESTNET_ADMIN_CAP_ID,
} from "./constants.js";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        religySyncPackageId: DEVNET_RELIGY_SYNC_PACKAGE_ID,
        platformId: DEVNET_PLATFORM_ID,
        adminCapId: DEVNET_ADMIN_CAP_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        religySyncPackageId: TESTNET_RELIGY_SYNC_PACKAGE_ID,
        platformId: TESTNET_PLATFORM_ID,
        adminCapId: TESTNET_ADMIN_CAP_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        religySyncPackageId: MAINNET_RELIGY_SYNC_PACKAGE_ID,
        // platformId: PLATFORM_ID,
        // adminCapId: ADMIN_CAP_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
