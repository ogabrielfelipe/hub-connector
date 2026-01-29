import DashboardPresenter from "../presenters/Dashboard.presenter";
import { useDashboard } from "../hooks/useDashboard";
import { Navigate } from "react-router-dom";


export default function DashboardContainer() {
    const { isAuthenticated } = useDashboard()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardPresenter />
    )
}