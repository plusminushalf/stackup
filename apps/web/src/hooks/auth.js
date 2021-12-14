import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isExpired } from 'react-jwt';
import {
  useAccountStore,
  accountUseAuthSelector,
  useSearchStore,
  searchUseAuthSelector,
  useActivityStore,
  activityUseAuthSelector,
  useWalletStore,
  walletUseAuthSelector,
  useOnboardStore,
  onboardUseAuthSelector,
} from '../state';
import { Routes } from '../config';

const REFRESH_INTERVAL_MS = 300000; // 5 minutes
const initAuthRoutes = new Set([Routes.LOGIN, Routes.SIGN_UP]);

export const useLogout = () => {
  const { logout } = useAccountStore(accountUseAuthSelector);
  const { clear: clearSearch } = useSearchStore(searchUseAuthSelector);
  const { clear: clearActivity } = useActivityStore(activityUseAuthSelector);
  const { clear: clearWallet } = useWalletStore(walletUseAuthSelector);
  const { clear: clearOnboard } = useOnboardStore(onboardUseAuthSelector);

  return async () => {
    clearSearch();
    clearActivity();
    clearWallet();
    clearOnboard();
    await logout();
  };
};

export const useAuth = () => {
  const router = useRouter();
  const { accessToken, refreshToken, refresh, enableAccount } =
    useAccountStore(accountUseAuthSelector);
  const logout = useLogout();
  const [isFirst, setIsFirst] = useState(true);

  const isLoggedOut = () => !refreshToken;
  const refreshTokenExpired = () => isExpired(refreshToken?.token);
  const accessTokenExpired = () => isExpired(accessToken?.token);
  const notOnLoginOrSignUpPage = () => !initAuthRoutes.has(location.pathname);
  const onLoginPage = () => location.pathname === Routes.LOGIN;
  const shouldRefresh = () => accessToken && refreshToken && !isExpired(refreshToken.token);

  useEffect(() => {
    const authCheck = async () => {
      try {
        if (isLoggedOut()) {
          notOnLoginOrSignUpPage() && router.push(Routes.LOGIN);
        } else if (refreshTokenExpired()) {
          await logout();
          notOnLoginOrSignUpPage() && router.push(Routes.LOGIN);
        } else if (isFirst) {
          setIsFirst(false);
          await refresh();
        } else {
          accessTokenExpired() && (await refresh());
          onLoginPage() && router.push(Routes.HOME);
        }
      } catch (error) {
        console.error(error);
        await logout().catch(console.error);
      }
    };

    authCheck().then(enableAccount);
  }, [refreshToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldRefresh()) {
        refresh();
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);
};
