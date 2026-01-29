/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import Cookies from "js-cookie";

// =====================
// Tipagens
// =====================
interface AuthContextData {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
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
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // =====================
    // Carrega token do cookie
    // =====================
    useEffect(() => {
        const storedToken = Cookies.get(TOKEN_KEY);

        if (storedToken) {
            setToken(storedToken);
        }

        setIsLoading(false);
    }, []);

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


    // Value
    // =====================
    const value: AuthContextData = {
        token,
        isAuthenticated: !!token,
        isLoading,
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
