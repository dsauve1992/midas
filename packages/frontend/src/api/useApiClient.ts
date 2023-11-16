import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import { MidasBackendClient } from "./MidasBackendClient.ts";

export const useApiClientInstance = <T extends MidasBackendClient>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TConstructor: new (...args: any[]) => T,
) => {
  const { getAccessTokenSilently } = useAuth0();

  return useMemo(() => {
    return new TConstructor(getAccessTokenSilently);
  }, [getAccessTokenSilently, TConstructor]);
};
