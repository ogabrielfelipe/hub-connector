import { useAuth } from "@/shared/contexts/authContext"



export function useDashboard() {
    const { logout, isAuthenticated } = useAuth()

    return {
        logout,
        isAuthenticated
    }
}