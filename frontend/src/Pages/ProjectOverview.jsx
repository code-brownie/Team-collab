import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { AuthContext } from "../context/AuthContext";

const ProjectOverview = () => {
    const [Project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
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
            console.error("Error fetching project:", error.message);
        } finally {
            setLoading(false);
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
        if (id) {
            setProjectId(id);
            getProject();
        } else {
            console.error("No projectId available in context");
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!Project) {
        return <div>Project data not found.</div>;
    }

    const chartData = {
        labels: ["Completed Tasks", "Pending Tasks"],
        datasets: [
            {
                data: [Project.tasksCompleted, Project.totalTasks - Project.tasksCompleted],
                backgroundColor: ["#124559", "#598392"],
                hoverBackgroundColor: ["#45A049", "#FF1744"],
            },
        ],
    };

    const chartOptions = {
        cutout: "50%",
    };

    return (
        <div className="p-6 flex flex-col space-y-6">
            {/* Header Section */}
            <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{Project.name}</h1>
                    <p className="text-gray-600 mt-2">{Project.description}</p>
                    <div className="mt-4 flex space-x-6 text-sm text-gray-500">
                        <div>
                            <span className="font-semibold">Deadline:</span> {formatDateToDDMMYYYY(Project.deadline)}
                        </div>
                        <div>
                            <span className="font-semibold">Created:</span> {formatDateToDDMMYYYY(Project.createdAt)}
                        </div>
                        <div>
                            <span className="font-semibold">Progress:</span>{" "}
                            {((Project.tasksCompleted / Project.totalTasks) * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Team Members and Progress Section */}
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                <div className="bg-white shadow rounded-lg p-6 w-full md:w-1/3 flex justify-center items-center">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>

                <div className="bg-white shadow rounded-lg p-6 w-full md:w-2/3">
                    <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
                    <ul className="mt-4 space-y-2">
                        {members.Users.map((user) => (
                            <li
                                key={user.id}
                                className="flex justify-between items-center border p-4 rounded-lg"
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
                <h2 className="text-xl font-bold text-gray-800">Tasks</h2>
                <div className="mt-4">
                    <p className="text-gray-600">
                        <span className="font-semibold">{Project.tasksCompleted}</span> of{" "}
                        <span className="font-semibold">{Project.totalTasks}</span> tasks
                        completed.
                    </p>
                    <div className="bg-gray-200 rounded-full h-4 w-full mt-2">
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{
                                width: `${(Project.tasksCompleted / Project.totalTasks) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
