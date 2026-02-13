import DashboardPresenter from "../presenters/Dashboard.presenter";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardContainer() {
    const { dashboardData, isLoading } = useDashboard();
    return (
        <DashboardPresenter dashboardData={dashboardData} isLoading={isLoading} />
    )
}