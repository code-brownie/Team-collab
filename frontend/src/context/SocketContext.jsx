/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_SOCKET_BASE_URL_PROD
        : import.meta.env.VITE_SOCKET_BASE_URL_DEV;
// Create socket instance without connecting immediately
const socket = io(URL, {
    withCredentials: true,
    autoConnect: false, // Don't connect automatically
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect the socket
        socket.connect();

        const onConnect = () => {
            console.log("Socket connected successfully");
            setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        };

        const onError = (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);