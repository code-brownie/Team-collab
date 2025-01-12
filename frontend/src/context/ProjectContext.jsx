/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { toast } from "@/hooks/use-toast";
import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [Project, setProject] = useState(null);
    const [members, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState({
        'To Do': [],
        'In Progress': [],
        'Review': [],
        'Done': []
    });
    const [totalTasks, setTotalTasks] = useState(0);
    const [tasksCompleted, setTaskCompleted] = useState(0);
    const fetchProject = async (projectId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/project/getOne?projectId=${projectId}`);
            if (!response.ok) throw new Error("Failed to fetch project data");

            const data = await response.json();
            setProject(data.project);

            const teamId = data.project.teamId;
            const teamResponse = await fetch(`${API_BASE_URL}/team/getAll?teamId=${teamId}`);
            if (!teamResponse.ok) throw new Error("Failed to fetch team members");

            const teamData = await teamResponse.json();
            setTeamMembers(teamData.members);
        } catch (error) {
            console.error("Error fetching project:", error.message);
        } finally {
            setLoading(false);
        }
    };
    const getTask = async (projectId, userId) => {
        try {
            console.log('members in the getTask', members);
            const response = await fetch(`${API_BASE_URL}/task/taskforUser?id=${projectId}&UserId=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data_Task = await response.json();
            if (response.ok) {
                // Group tasks by status
                const groupedTasks = {
                    'To Do': [],
                    'In Progress': [],
                    'Review': [],
                    'Done': []
                };
                data_Task.Task.forEach(task => {
                    if (groupedTasks[task.status]) {
                        groupedTasks[task.status].push(task);
                    } else {
                        groupedTasks['To Do'].push(task);
                    }
                });

                setTasks(groupedTasks);
                setTaskCompleted(groupedTasks.Done.length);
                setTotalTasks(data_Task.Task.length);

            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch Task data.",
                variant: "destructive",
            });
            console.log(error);
        }
    };
    return (
        <ProjectContext.Provider value={{ Project, members, loading, fetchProject, setTaskCompleted, setTasks, setTotalTasks, totalTasks, tasksCompleted, getTask, tasks }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);
