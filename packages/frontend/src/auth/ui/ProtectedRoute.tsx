import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoadingPage } from "../../ui/global/component/LoadingPage.tsx";
import { CSSTransition } from "react-transition-group";
import "./fade.css";

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

  return (
    <>
      <CSSTransition
        in={isLoading || !isAuthenticated}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <LoadingPage />
      </CSSTransition>
      {children ? children : <Outlet />}
    </>
  );
};
