import { LoginContainer } from "@/features/login";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { DashboardContainer } from "@/features/dashboard";
import { UsersContainer } from "@/features/users";
import { UsersCreateOrUpdateContainer } from "@/features/users";

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

            <Route
                path="/users"
                element={
                    <PrivateRoute>
                        <UsersContainer />
                    </PrivateRoute>
                }
            />

            <Route
                path="/users/new"
                element={
                    <PrivateRoute>
                        <UsersCreateOrUpdateContainer />
                    </PrivateRoute>
                }
            />

            <Route
                path="/users/edit/:id"
                element={
                    <PrivateRoute>
                        <UsersCreateOrUpdateContainer />
                    </PrivateRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<h1 className="text-center text-2xl font-bold">Página não encontrada</h1>} />
        </Routes>
    )
}