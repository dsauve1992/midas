import {useAuth0} from "@auth0/auth0-react";
import {useMemo} from "react";
import {MidasBackendClient} from "./MidasBackendClient.ts";

export const useApiClientInstance = <T extends MidasBackendClient>(TConstructor: new (...args: unknown[]) => T) => {
    const {getAccessTokenSilently} = useAuth0()

    return useMemo(() => {
        return new TConstructor(getAccessTokenSilently)
    }, [getAccessTokenSilently, TConstructor])
}