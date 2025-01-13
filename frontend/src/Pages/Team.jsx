import { useContext, useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { AuthContext } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";
const TeamsPage = () => {
    const { userId } = useContext(AuthContext);
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;    const [teamsData, setTeamsData] = useState({ allTeams: [] });
    const getTeamData = async () => {
        try {
            const response = await fetch(`${URL}/team/getAllTeam`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (response.ok) {
                setTeamsData(data);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch Team data.",
                variant: "destructive",
            });
            console.log(error.message);
        }
    }

    const updateTeamMembers = (teamId, updatedUsers) => {
        setTeamsData((prevState) => ({
            ...prevState,
            allTeams: prevState.allTeams.map((team) =>
                team.id === teamId ? { ...team, Users: updatedUsers } : team
            ),
        }));
    };

    useEffect(() => {
        if (userId && userId.id) {
            getTeamData();
        }
    }, [userId])

    return (
        <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Teams</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {teamsData.allTeams.map(team => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            updateTeamMembers={updateTeamMembers}
                            currentUserId={userId.id}
                        />
                    ))}
                    {teamsData.allTeams.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-sm md:text-base">No teams available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsPage;