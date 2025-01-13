/* eslint-disable react/prop-types */
import { useToast } from "@/hooks/use-toast";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { toast } = useToast();
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [projectId, setProjectId] = useState(() => localStorage.getItem("projectId") || null);
    const navigate = useNavigate();
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;    const fetchUserDetails = async (id) => {
        try {
            const response = await fetch(`${URL}/users/GetUserById?id=${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userDetails = await response.json();
                setUser(userDetails.user);
            } else {
                console.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        if (projectId) {
            localStorage.setItem("projectId", projectId);
        }
    }, [projectId]);

    // Validate the token and fetch user details on app start
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const response = await fetch(`${URL}/auth/protected`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserId(data.user);
                    } else {
                        // Handle token expiry or invalidation
                        const errorData = await response.json();
                        if (errorData.message === "Token expired. Please log in again.") {
                            logout(); // Clear token and user
                            alert("Your session has expired. Please log in again.");
                        }
                    }
                } catch (error) {
                    console.error("Error validating token:", error);
                    logout(); // Clear token and user
                }
            }
        };

        validateToken();
    }, [token]);


    // Save the token in localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("projectId");
        toast({
            title: "Logged out Successfully",
            variant: "default",
        });
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ userId, user, token, login, logout, setProjectId, projectId, fetchUserDetails }}>
            {children}
        </AuthContext.Provider>
    );
};
