/* eslint-disable react/prop-types */
import { useState } from "react";
import { Users, Info } from "lucide-react";

import JoinTeamForm from "../forms/TeamJoinForm";
import MangeMembers from "./MangeMembers";
import AddMember from "../forms/AddMember";
import { toast } from "@/hooks/use-toast";
import DialogWrapper from "./DailogWrapper";

const TeamCard = ({ team, currentUserId, updateTeamMembers }) => {
    const [isJoinDialogOpen, setJoinDialogOpen] = useState(false);
    const [isManageDialogOpen, setManageDialogOpen] = useState(false);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState(team.Users);
    const currentUser = team.Users.find((user) => user.id === currentUserId);
    const currentRole = currentUser?.TeamUser?.role || "Member";
const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV;    const handleSubmit = async (updatedMembers) => {
        try {
            const response = await fetch(`${URL}/team/updateTeam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId: team.id,
                    users: updatedMembers.map((member) => member.id),
                }),
            });

            if (response.ok) {
                toast({
                    title: "Team members updated successfully",
                    variant: "default",
                });
                updateTeamMembers(team.id, updatedMembers);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update team members.",
                variant: "destructive",
            });
            console.error("Error updating members:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{team.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">Members: {team.Users.length}</span>
                    </div>
                </div>
            </div>

            {team.description && (
                <div className="flex items-start space-x-2 mb-4">
                    <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 break-words">{team.description}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4 justify-end">
                {/* Join Team Dialog */}
                <button
                    onClick={() => setJoinDialogOpen(true)}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                    Join Team
                </button>
                <DialogWrapper
                    isOpen={isJoinDialogOpen}
                    onOpenChange={setJoinDialogOpen}
                    title="Join Team"
                    description="Enter the team join code to become a member of this team."
                >
                    <JoinTeamForm
                        onClose={() => setJoinDialogOpen(false)}
                        onJoinSuccess={(data) => {
                            updateTeamMembers(data.teamId, data.updatedMembers);
                            toast({
                                title: "Team joined successfully",
                                variant: "default",
                            });
                        }}
                    />
                </DialogWrapper>

                {currentRole === "Admin" && (
                    <>
                        {/* Manage Team Dialog */}
                        <button
                            onClick={() => setManageDialogOpen(true)}
                            className="px-3 md:px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                        >
                            Manage Team
                        </button>
                        <DialogWrapper
                            isOpen={isManageDialogOpen}
                            onOpenChange={setManageDialogOpen}
                            title="Manage Team Members"
                        >
                            <MangeMembers
                                members={teamMembers}
                                setMembers={setTeamMembers}
                                handleSubmit={handleSubmit}
                                onClose={() => setManageDialogOpen(false)}
                            />
                        </DialogWrapper>

                        {/* Add Member Dialog */}
                        <button
                            onClick={() => setAddDialogOpen(true)}
                            className="px-3 md:px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                            Add Member
                        </button>
                        <DialogWrapper
                            isOpen={isAddDialogOpen}
                            onOpenChange={setAddDialogOpen}
                            title="Add Member"
                        >
                            <AddMember
                                joinCode={team.joinCode}
                                onClose={() => setAddDialogOpen(false)}
                            />
                        </DialogWrapper>
                    </>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
