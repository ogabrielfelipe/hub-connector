import { useAuth } from "@/shared/contexts/authContext";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return null;
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
