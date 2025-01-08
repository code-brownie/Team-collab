import { AuthContext } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import { useContext, useEffect, useCallback } from "react";

const RegisterUser = () => {
    const { userId } = useContext(AuthContext);
    const { socket, isConnected } = useSocket();

    const registerUser = useCallback(() => {
        if (userId?.id && isConnected) {
            console.log('Registering user with ID:', userId.id);
            socket.emit("register", userId.id);
        }
    }, [userId?.id, isConnected, socket]);

    useEffect(() => {
        // Set up listeners
        socket.on('registered', (data) => {
            console.log('Registration confirmed:', data);
        });

        // Attempt to register whenever connection status or userId changes
        registerUser();

        return () => {
            socket.off('registered');
        };
    }, [socket, registerUser]);

    // Log state changes
    useEffect(() => {
        console.log('Connection status:', isConnected);
        console.log('Current userId:', userId?.id);
    }, [isConnected, userId]);

    return null;
};

export default RegisterUser;