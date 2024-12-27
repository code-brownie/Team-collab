/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [projectId, setProjectId] = useState(() => localStorage.getItem("projectId") || null);

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
                    const response = await fetch("http://localhost:3000/api/auth/protected", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
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
        setToken(newToken); // Set token in state
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setProjectId, projectId }}>
            {children}
        </AuthContext.Provider>
    );
};
