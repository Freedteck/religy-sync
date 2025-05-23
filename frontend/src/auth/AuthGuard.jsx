import { Navigate } from "react-router-dom";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNetworkVariable } from "../config/networkConfig";

const AuthGuard = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const account = useCurrentAccount();
  const adminCapId = useNetworkVariable("adminCapId");

  const { data, isLoading } = useSuiClientQuery(
    "getObject",
    {
      id: adminCapId,
      options: {
        showOwner: true,
      },
    },
    {
      select: (data) => data.data?.owner?.AddressOwner,
      enabled: !!account,
    }
  );

  useEffect(() => {
    if (!isLoading) {
      if (account && account.address === data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
  }, [data, account, isLoading]);

  if (loading) {
    return <div>Checking permissions...</div>;
  }

  // If requireAdmin is true and user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // If requireAdmin is false and user is admin, redirect to admin dashboard
  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
};

export default AuthGuard;
