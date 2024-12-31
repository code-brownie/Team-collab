/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { AuthContext } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";

const ProjectOverview = () => {
    const { user } = useContext(AuthContext);
    const [Project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [task, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [tasksCompleted, setTaskCompleted] = useState(0);
    const navigate = useNavigate();
    const { setProjectId } = useContext(AuthContext);
    const { id } = useParams();
    const getProject = async () => {
        try {
            const response_project = await fetch(`http://localhost:3000/api/project/getOne?projectId=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response_project.ok) {
                throw new Error("Failed to fetch project data");
            }
            const data_project = await response_project.json();
            setProject(data_project.project);

            const teamId = data_project.project.teamId;
            const response_members = await fetch(`http://localhost:3000/api/team/getAll?teamId=${teamId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data_member = await response_members.json();
            if (response_members.ok) {
                setMembers(data_member.members);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch project data.",
                variant: "destructive",
            });
            console.error("Error fetching project:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTask = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/task/taskforUser?id=${id}&UserId=${user.id}`, {
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

    function formatDateToDDMMYYYY(isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    useEffect(() => {
        if (id && user) {
            setProjectId(id);
            getProject();
            getTask();
        }
    }, [id, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!Project) {
        return <div>Project data not found.</div>;
    }
    const chartData = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [tasksCompleted, totalTasks - tasksCompleted],
                backgroundColor: ["#6366F1", "#A5B4FC"],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    padding: 20,
                    boxWidth: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const total = tasksCompleted + (totalTasks - tasksCompleted);
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        cutout: "70%",
    };

    return (
        <div className="p-6 flex flex-col space-y-6">
            {/* Header Section */}
            <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{Project?.name}</h1>
                    <p className="text-gray-600 mt-2">{Project?.description}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div>
                            <span className="font-semibold">Deadline:</span> {formatDateToDDMMYYYY(Project?.deadline)}
                        </div>
                        <div>
                            <span className="font-semibold">Created:</span> {formatDateToDDMMYYYY(Project?.createdAt)}
                        </div>
                        <div>
                            <span className="font-semibold">Progress:</span>{" "}
                            {tasksCompleted != 0 ? ((tasksCompleted / totalTasks) * 100).toFixed(0) : '0'}%
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 md:mt-0 bg-gray-900 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Team Members and Progress Section */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white shadow rounded-lg p-6 w-full md:w-1/3">
                    <div className="h-64 relative">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 text-center text-gray-700 font-semibold">
                        Total Tasks: {totalTasks}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 w-full md:w-2/3">
                    <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                    <ul className="mt-4 space-y-2">
                        {members?.Users?.map((user) => (
                            <li
                                key={user.id}
                                className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition"
                            >
                                <span className="font-semibold">{user.name}</span>
                                <span className="text-gray-500 text-sm">{user.TeamUser.role}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tasks Summary Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800">Tasks Progress</h2>
                <div className="mt-4">
                    <p className="text-gray-600">
                        <span className="font-semibold">{tasksCompleted}</span> of{" "}
                        <span className="font-semibold">{totalTasks}</span> tasks
                        completed
                    </p>
                    <div className="bg-gray-200 rounded-full h-4 w-full mt-2 overflow-hidden">
                        <div
                            className="bg-green-500 h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;