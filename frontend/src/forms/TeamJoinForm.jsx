/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext'
import { toast } from "@/hooks/use-toast";
const JoinTeamForm = ({ onClose, onJoinSuccess }) => {
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");
    const { userId } = useContext(AuthContext);
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;    const handleJoin = async () => {
        try {
            const response = await fetch(`${URL}/team/joinTeam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ joinCode, userId: userId.id }),
            });

            const data = await response.json();
            if (response.ok) {
                onJoinSuccess(data);
                onClose();
            } else {
                setError(data.message);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to join the Team.",
                variant: "destructive",
            });
            console.error("Error joining team:", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="rounded-lg w-full max-w-md bg-white">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex flex-col mb-4">
                <label htmlFor="joinCode" className="text-sm font-medium text-gray-600 mb-2">
                    Team Join Code
                </label>
                <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter Join Code"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none"
                    maxLength={8}
                />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleJoin}
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                    Join Team
                </button>
            </div>
        </div>
    );
};

export default JoinTeamForm;
