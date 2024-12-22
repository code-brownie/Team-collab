/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    // Validate the token and fetch user details on app start
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                console.log('token',token)
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
                        logout();
                    }
                } catch (error) {
                    console.error("Error validating token:", error);
                    logout();
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
        console.log('hi inside the login');
        setToken(newToken); // Set token in state
    };

    const logout = () => {
        setToken(null); 
        setUser(null); 
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
