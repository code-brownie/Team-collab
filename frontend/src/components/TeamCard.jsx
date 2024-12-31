/* eslint-disable react/prop-types */
import { useState } from "react";
import { Users, Info } from "lucide-react";
import Modal from "./Modal";
import MangeMembers from "./MangeMembers";
import JoinTeamForm from "../forms/TeamJoinForm";
import AddMember from "../forms/AddMember";
import { toast } from "@/hooks/use-toast";
const TeamCard = ({ team, currentUserId, updateTeamMembers }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [isJoinModalOpen, setJoinModalOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState(team.Users);
    const currentUser = team.Users.find((user) => user.id === currentUserId);
    const currentRole = currentUser?.TeamUser?.role || "Member";

    const handleSubmit = async (updatedMembers) => {
        try {
            const response = await fetch(`http://localhost:3000/api/team/updateTeam`, {
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
                setModalOpen(false);
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
    const handleJoinTeam = () => {
        setJoinModalOpen(true);
    };
    const handleAddTeam = () => {
        setAddMemberModalOpen(true);
    };
    const handleManageTeam = () => {
        setModalOpen(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{team.name}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">Members: {team.Users.length}</span>
                    </div>
                </div>
            </div>

            {team.description && (
                <div className="flex items-start space-x-2 mb-4">
                    <Info className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-sm text-gray-600">{team.description}</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 mt-4">
                <button
                    onClick={handleJoinTeam}
                    className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                    Join Team
                </button>

                {currentRole === "Admin" && (
                    <button
                        onClick={handleManageTeam}
                        className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                    >
                        Manage Team
                    </button>
                )}
                {currentRole === "Admin" && (
                    <button
                        onClick={handleAddTeam}
                        className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors">
                        Add Memember
                    </button>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                heading="Manage Team Members"
            >
                <MangeMembers
                    members={teamMembers}
                    setMembers={setTeamMembers}
                    handleSubmit={handleSubmit}
                    setModalOpen={setModalOpen}
                />
            </Modal>
            <Modal
                isOpen={isJoinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                heading="Join Team"
            >
                <JoinTeamForm
                    onClose={() => setJoinModalOpen(false)}
                    onJoinSuccess={(data) => {
                        updateTeamMembers(data.teamId, data.updatedMembers);
                        toast({
                            title: "Team joined successfully",
                            variant: "default",
                        });
                    }}
                />
            </Modal>
            <Modal
                isOpen={isAddMemberModalOpen}
                onClose={() => setAddMemberModalOpen(false)}
                heading="Add Member"
            >
                <AddMember
                    joinCode={team.joinCode}
                    onClose={() => setAddMemberModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default TeamCard;
