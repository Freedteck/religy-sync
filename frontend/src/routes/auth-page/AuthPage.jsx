import { useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import {
  FaGoogle,
  FaFacebookF,
  FaTwitch,
  FaWallet,
  FaTimes,
} from "react-icons/fa";
import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import Loading from "../../components/loading/Loading";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();

  // Get all wallets
  const allWallets = useWallets();

  // Filter out Enoki wallets (for OAuth)
  const enokiWallets = allWallets.filter(isEnokiWallet);
  // Regular wallets (non-Enoki)
  const regularWallets = allWallets.filter((wallet) => !isEnokiWallet(wallet));

  // Organize Enoki wallets by provider
  const walletsByProvider = enokiWallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map()
  );

  const googleWallet = walletsByProvider.get("google");
  const facebookWallet = walletsByProvider.get("facebook");
  const twitchWallet = walletsByProvider.get("twitch");

  // Redirect to landing page when account is connected
  useEffect(() => {
    if (currentAccount) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentAccount]);

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    setConnectionError(null);

    const walletMap = {
      google: googleWallet,
      facebook: facebookWallet,
      twitch: twitchWallet,
    };

    const wallet = walletMap[provider.toLowerCase()];

    if (!wallet) {
      setIsLoading(false);
      setConnectionError(`${provider} login not available`);
      return;
    }

    connect(
      { wallet },
      {
        onSuccess: () => console.log(`${provider} login initiated`),
        onError: (error) => {
          console.error(`${provider} login error:`, error);
          setIsLoading(false);
          setConnectionError(`${provider} login cancelled or failed`);
        },
      }
    );
  };

  const handleWalletConnect = (wallet) => {
    setIsLoading(true);
    setConnectionError(null);
    connect(
      { wallet },
      {
        onSuccess: () => console.log(`Connected to ${wallet.name}`),
        onError: (error) => {
          console.error("Connection error:", error);
          setIsLoading(false);
          setConnectionError(
            error.message || "Wallet connection cancelled or failed"
          );
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* Loading overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <Loading message="Authenticating..." />
        </div>
      )}

      {/* Error message */}
      {connectionError && (
        <div className={styles.errorMessage}>
          <p>{connectionError}</p>
          <button
            onClick={() => setConnectionError(null)}
            className={styles.dismissButton}
            aria-label="Dismiss error message"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          ReligySync
        </a>
      </header>

      {/* Main Content */}
      <div className={styles.wrapper}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Welcome to ReligySync</h1>
          <p className={styles.authSubtitle}>
            Connect securely using your favorite provider or crypto wallet. Your
            privacy is protected with zkLogin technology.
          </p>

          <div className={styles.authButtons}>
            <button
              className={`${styles.authButton} ${styles.googleButton}`}
              onClick={() => handleOAuthLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle className={styles.authButtonIcon} />
              Continue with Google
            </button>

            <button
              className={`${styles.authButton} ${styles.facebookButton}`}
              onClick={() => handleOAuthLogin("facebook")}
              disabled={isLoading}
            >
              <FaFacebookF className={styles.authButtonIcon} />
              Continue with Facebook
            </button>

            <button
              className={`${styles.authButton} ${styles.twitchButton}`}
              onClick={() => handleOAuthLogin("Twitch")}
              disabled={isLoading}
            >
              <FaTwitch className={styles.authButtonIcon} />
              Continue with Twitch
            </button>
          </div>

          <div className={styles.authDivider}>or</div>

          <div className={styles.walletButtons}>
            {regularWallets.length > 0 ? (
              regularWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  className={`${styles.authButton} ${styles.walletButton}`}
                  onClick={() => handleWalletConnect(wallet)}
                  disabled={isLoading}
                >
                  <FaWallet className={styles.authButtonIcon} />
                  Connect with {wallet.name}
                </button>
              ))
            ) : (
              <div className={styles.noWalletsMessage}>
                No wallets detected. Please install a wallet extension.
              </div>
            )}
          </div>

          <div className={styles.zkInfo}>
            <div className={styles.zkInfoTitle}>Zero-Knowledge Privacy</div>
            <p className={styles.zkInfoText}>
              ReligySync uses zkLogin to verify your identity without exposing
              personal data. Your Web2 and Web3 identities remain private.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>
            Privacy Policy
          </a>
          <a href="#" className={styles.footerLink}>
            Terms of Service
          </a>
          <a href="#" className={styles.footerLink}>
            Help Center
          </a>
        </div>
        <div className={styles.copyright}>
          © 2025 ReligySync - Secure Authentication with zkLogin
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
