import Loading from "@/shared/components/loading";
import { useAuth } from "@/shared/contexts/authContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        console.log("loading")
        return <Loading />;
    }

    if (!isAuthenticated) {
        console.log("not authenticated")
        return <Navigate to="/login" replace />;
    }

    return children;
}
