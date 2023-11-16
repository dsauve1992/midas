import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoadingPage } from "../../ui/global/component/LoadingPage.tsx";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    (async () => {
      await loginWithRedirect({
        appState: {
          returnTo: pathname,
        },
      });
    })();
  }, [isAuthenticated, isLoading, loginWithRedirect, pathname]);

  if (isLoading || !isAuthenticated) {
    return <LoadingPage />;
  }

  return children ? children : <Outlet />;
};
