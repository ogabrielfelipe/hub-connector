/* eslint-disable react-refresh/only-export-components */

"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { getAuthMe, type GetAuthMe200 } from "../api/hubConnectorAPI";

// =====================
// Tipagens
// =====================
interface AuthContextData {
    token: string | null;
    isAuthenticated: boolean;
    userLogged: GetAuthMe200 | null;
    isLoadingAuth: boolean;
    login: (token: string, redirectTo?: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

// =====================
// Constantes
// =====================
const TOKEN_KEY = "auth_token";
const TOKEN_EXPIRES_DAYS = 1; // 1 dia

// =====================
// Context
// =====================
const AuthContext = createContext<AuthContextData | undefined>(undefined);

// =====================
// Provider
// =====================
export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(() => {
        return Cookies.get(TOKEN_KEY) || null;
    })
    const [userLogged, setUserLogged] = useState<GetAuthMe200 | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);



    // =====================
    // Login
    // =====================
    const login = (apiToken: string) => {
        Cookies.set(TOKEN_KEY, apiToken, {
            expires: TOKEN_EXPIRES_DAYS,
            secure: true,
            sameSite: "strict",
        });

        setToken(apiToken);

    };

    // =====================
    // Logout
    // =====================
    const logout = () => {
        Cookies.remove(TOKEN_KEY);
        setToken(null);

    };



    useEffect(() => {

        if (!token) {
            setUserLogged(null);
            setIsLoadingAuth(false);
            return;
        }

        let isActive = true;

        const getUserLogged = async () => {
            try {
                const response = await getAuthMe();

                if (isActive) setUserLogged(response);
            } catch (error) {
                console.log(error);
                if (isActive) {
                    setUserLogged(null);
                    setToken(null);
                    Cookies.remove(TOKEN_KEY);
                }
            } finally {
                if (isActive) setIsLoadingAuth(false);
            }
        };

        getUserLogged();

        return () => {
            isActive = false;
        };
    }, [token]);


    // Value
    // =====================
    const value: AuthContextData = {
        token,
        isAuthenticated: !!userLogged,
        isLoadingAuth,
        userLogged,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =====================
// Hook
// =====================
export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}
