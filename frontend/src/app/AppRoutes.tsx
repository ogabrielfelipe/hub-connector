import { LoginContainer } from "@/features/login/containers/Login.container";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DashboardContainer from "@/features/dashboard/containers/Dashboard.container";

export function AppRoutes() {
    return (
        <Routes>

            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginContainer />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <DashboardContainer />
                    </PrivateRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<h1 className="text-center text-2xl font-bold">Página não encontrada</h1>} />
        </Routes>
    )
}