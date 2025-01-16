/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useToast } from "@/hooks/use-toast";
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { toast } = useToast();
    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("token"));
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [projectId, setProjectId] = useState(() => localStorage.getItem("projectId") || null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshPromise = useRef(null);
    const navigate = useNavigate();

    const URL = import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_API_BASE_URL_PROD
        : import.meta.env.VITE_API_BASE_URL_DEV;

    // Function to check token expiration
    const checkTokenExpiration = useCallback((token) => {
        if (!token) return 0;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp - Math.floor(Date.now() / 1000); // Seconds until expiration
        } catch (error) {
            console.error("Error checking token expiration:", error);
            return 0;
        }
    }, []);


    // Function to refresh token
    const refreshAccessToken = useCallback(async () => {
        // If already refreshing, return the existing promise
        if (refreshPromise.current) {
            return refreshPromise.current;
        }

        setIsRefreshing(true);

        // Create new refresh promise
        refreshPromise.current = (async () => {
            try {
                const response = await fetch(`${URL}/auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!response.ok) {
                    throw new Error("Refresh failed");
                }

                const data = await response.json();
                setAccessToken(data.accessToken);
                localStorage.setItem("token", data.accessToken);
                return data.accessToken;
            } catch (error) {
                logout();
                throw error;
            } finally {
                setIsRefreshing(false);
                refreshPromise.current = null;
            }
        })();

        return refreshPromise.current;
    }, [refreshToken, URL]);

    // Enhanced fetch function with automatic token refresh
    const authenticatedFetch = useCallback(
        async (url, options = {}) => {
            if (!accessToken) throw new Error("No token available");

            // Check if token needs refresh (if less than 5 minutes remaining)
            const timeUntilExpiry = checkTokenExpiration(accessToken);
            if (timeUntilExpiry < 300 && refreshToken) {
                try {
                    const newToken = await refreshAccessToken();
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`,
                    };
                } catch (error) {
                    throw new Error("Unable to refresh token");
                }
            } else {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await fetch(url, options);

            // If request fails with 401, try refreshing token once
            if (response.status === 401 && refreshToken && !isRefreshing) {
                try {
                    const newToken = await refreshAccessToken();
                    options.headers.Authorization = `Bearer ${newToken}`;
                    return fetch(url, options);
                } catch (error) {
                    throw new Error("Authentication failed");
                }
            }

            return response;
        },
        [accessToken, refreshToken, isRefreshing, refreshAccessToken, checkTokenExpiration]
    );

    const login = useCallback((tokens) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        localStorage.setItem("token", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
    }, []);

    const logout = useCallback(() => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("projectId");

        toast({
            title: "Logged out Successfully",
            variant: "default",
        });
        navigate("/");
    }, [navigate, toast]);

    const fetchUserDetails = useCallback(
        async (id) => {
            try {
                const response = await authenticatedFetch(`${URL}/users/GetUserById?id=${id}`);
                if (response.ok) {
                    const userDetails = await response.json();
                    setUser(userDetails.user);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        },
        [authenticatedFetch, URL]
    );

    // Token validation on app start and token changes
    useEffect(() => {
        const validateToken = async () => {
            if (accessToken) {
                try {
                    const response = await authenticatedFetch(`${URL}/auth/protected`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserId(data.user);
                    }
                } catch (error) {
                    //
                }
            }
        };

        validateToken();
    }, [accessToken, authenticatedFetch, URL]);

    useEffect(() => {
        if (projectId) {
            localStorage.setItem("projectId", projectId);
        }
    }, [projectId]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem("token", accessToken);
        } else {
            localStorage.removeItem("token");
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                userId,
                user,
                token: accessToken,
                login,
                logout,
                setProjectId,
                projectId,
                fetchUserDetails,
                authenticatedFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
