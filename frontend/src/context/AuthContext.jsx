/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if user is logged in when the app starts
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/protected", {
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };

        checkUserLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
