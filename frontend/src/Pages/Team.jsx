import { useContext, useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { AuthContext } from "../context/AuthContext";
const TeamsPage = () => {
    const { userId } = useContext(AuthContext);
    const [teamsData, setTeamsData] = useState({ allTeams: [] });
    const getTeamData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/team/getAllTeam', {
                method: 'GET',
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (response.ok) {
                setTeamsData(data);
            }
        } catch (error) {
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Teams</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamsData.allTeams.map(team => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            updateTeamMembers={updateTeamMembers}
                            currentUserId={userId.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamsPage;