/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import CreateTeamForm from "./CreateTeam";
import CreateProjectForm from "./CreateProject";
import AddMembersForm from "./AddTeam";
import Stepper from '../components/Stepper';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MultiStepForm = () => {
    const { userId, setProjectId } = useContext(AuthContext);
    const UserId = userId.id;
    const [currentStep, setCurrentStep] = useState(1);
    const [teamData, setTeamData] = useState({ teamName: "", description: "" });
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectDescription: "",
        deadline: "",
    });
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const backStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        const membersId = members.map((member) => member.id);

        // Include the creator Id also
        if (!membersId.includes(UserId)) {
            membersId.push(UserId);
        }
        // create the Team
        try {
            const team_response = await fetch('http://localhost:3000/api/team/createTeam', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: teamData.teamName,
                    description: teamData.description,
                    adminId: userId.id
                }),
            });
            const createdTeam = await team_response.json();
            const teamId = createdTeam.Team.id;

            // Adding the members to the Team
            await fetch(`http://localhost:3000/api/team/${teamId}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    users: membersId
                }),
            });

            // Create the Project using the team Id
            const project_response = await fetch('http://localhost:3000/api/project/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: projectData.projectName,
                    description: projectData.projectDescription,
                    teamId,
                    deadline: projectData.deadline
                }),
            });
            const newProject = await project_response.json();
            const projectId = newProject.project.id;
            if (project_response.ok) {
                localStorage.setItem("projectId", projectId);
                setProjectId(projectId);
                alert('project created successfully');

                // Add the users to the Project
                await fetch("http://localhost:3000/api/project/addUsertoProject", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }, body: JSON.stringify({ userIds: membersId, projectId })
                });
                navigate(`/project/${projectId}/overview`);
            }


        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Stepper currentStep={currentStep} />
            <div className="w-full max-w-xl p-8 bg-white shadow-lg rounded-lg">
                {currentStep === 1 && (
                    <CreateTeamForm data={teamData} setData={setTeamData} nextStep={nextStep} />
                )}
                {currentStep === 2 && (
                    <CreateProjectForm
                        data={projectData}
                        setData={setProjectData}
                        nextStep={nextStep}
                        backStep={backStep}
                    />
                )}
                {currentStep === 3 && (
                    <AddMembersForm
                        members={members}
                        setMembers={setMembers}
                        backStep={backStep}
                        handleSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default MultiStepForm;
