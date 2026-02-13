import { useGetReportDashboard } from "@/shared/api/hubConnectorAPI";
import { useAuth } from "@/shared/contexts/authContext"



export function useDashboard() {
    const { logout, isAuthenticated } = useAuth()

    const { data: dashboardData, isLoading } = useGetReportDashboard();

    return {
        logout,
        isAuthenticated,
        dashboardData,
        isLoading
    }
}