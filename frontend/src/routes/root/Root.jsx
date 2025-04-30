import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "./Root.module.css";
import Footer from "../../components/footer/Footer";
import { Toaster } from "react-hot-toast";
import useScholarStatus from "../../hooks/useScholarStatus";
import { useNetworkVariables } from "../../config/networkConfig";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { WalletContext } from "../../context/walletContext";
import ScrollToTop from "../../components/scroll-to-top/ScrollToTop";

const Root = () => {
  const [balance, setBalance] = useState(null);
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );
  const suiClient = useSuiClient();
  const account = useCurrentAccount();

  const { isScholar } = useScholarStatus(
    suiClient,
    religySyncPackageId,
    platformId,
    account
  );

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && suiClient) {
        try {
          const { totalBalance } = await suiClient.getBalance({
            owner: account.address,
          });
          setBalance((Number(totalBalance) / 1_000_000_000).toFixed(2));
        } catch (err) {
          console.error("Error fetching balance:", err);
        }
      }
    };

    fetchBalance();
  }, [account, suiClient]);

  return (
    <WalletContext.Provider
      value={{ balance, isScholar, isConnected: !!account }}
    >
      <ScrollToTop />
      <div className={styles.root}>
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Outlet />
        </div>
        <Footer />
      </div>
    </WalletContext.Provider>
  );
};

export default Root;
