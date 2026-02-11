import Loading from "@/shared/components/loading";
import { useAuth } from "@/shared/contexts/authContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <Loading />; // ou spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
