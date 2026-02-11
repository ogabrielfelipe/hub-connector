import { LoginContainer } from "@/features/login";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { DashboardContainer } from "@/features/dashboard";
import { UsersContainer } from "@/features/users";
import { UsersCreateOrUpdateContainer } from "@/features/users";
import { GatewaysContainer, GatewaysCreateOrUpdateContainer } from "@/features/gateways";

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

            {/**
             * Users routes
             */}

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


            {/**
             * Gateways routes
             */}


            <Route
                path="/gateways"
                element={
                    <PrivateRoute>
                        <GatewaysContainer />
                    </PrivateRoute>
                }
            />

            <Route
                path="/gateways/new"
                element={
                    <PrivateRoute>
                        <GatewaysCreateOrUpdateContainer />
                    </PrivateRoute>
                }
            />

            <Route
                path="/gateways/edit/:id"
                element={
                    <PrivateRoute>
                        <GatewaysCreateOrUpdateContainer />
                    </PrivateRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<h1 className="text-center text-2xl font-bold">Página não encontrada</h1>} />
        </Routes>
    )
}