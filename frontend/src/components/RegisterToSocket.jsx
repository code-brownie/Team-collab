/* eslint-disable react/prop-types */
import { AuthContext } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

import { useContext, useEffect, useCallback, useState } from "react";

const RegisterUser = ({SetTeamId}) => {
    const { userId } = useContext(AuthContext);
    const { socket, isConnected } = useSocket();
    const { projectId } = useContext(AuthContext);
    const [teamId, setTeamId] = useState(null);
    const [teamMemberIds, setTeamMemberIds] = useState([]);

    const getTeamMembers = async () => {
        try {
            const response_project = await fetch(
                `http://localhost:3000/api/project/getOne?projectId=${projectId}`,
                { method: "GET", headers: { "Content-Type": "application/json" } }
            );

            if (!response_project.ok) {
                throw new Error("Failed to fetch project data in RegisterToSocket");
            }

            const data_project = await response_project.json();
            const fetchedTeamId = data_project.project.teamId;

            const response_members = await fetch(
                `http://localhost:3000/api/team/getAll?teamId=${fetchedTeamId}`,
                { method: "GET", headers: { "Content-Type": "application/json" } }
            );

            const data_member = await response_members.json();
            if (response_members.ok) {
                const memberIds = data_member.members.Users.map((user) => user.id);
                setTeamId(fetchedTeamId);
                SetTeamId(fetchedTeamId);
                setTeamMemberIds(memberIds);
            }
        } catch (error) {
            console.error("Error fetching team members:", error.message);
        }
    };

    useEffect(() => {
        if (projectId) {
            getTeamMembers();
        }
    }, [projectId]);

    const registerUserAndTeam = useCallback(() => {
        if (userId?.id && isConnected && teamId && teamMemberIds.length > 0) {
            // Register individual user
            socket.emit("register", userId.id);

            // Register the team and its members
            socket.emit("registerTeam", { teamId, memberIds: teamMemberIds });
        }
    }, [userId?.id, isConnected, socket, teamId, teamMemberIds]);

    useEffect(() => {
        // Set up listeners
        socket.on('registered', (data) => {
            console.log('User registered:', data);
        });

        socket.on('teamRegistered', (data) => {
            console.log('Team registered:', data);
        });

        // Attempt to register whenever connection status, userId, or team changes
        registerUserAndTeam();

        return () => {
            socket.off('registered');
            socket.off('teamRegistered');
        };
    }, [socket, registerUserAndTeam]);

    return null;
};

export default RegisterUser;


