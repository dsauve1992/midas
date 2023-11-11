import {PropsWithChildren} from "react";
import {Outlet} from "react-router-dom";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    // TODO
    // const { isAuthenticated } = useAuth0();
    //
    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace/>;
    // }

    return children ? children : <Outlet />;
};