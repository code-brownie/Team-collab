import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users, CheckCircle, ArrowLeft } from "lucide-react";
import ProgressChart from "@/components/ChartSection";
import Spinner from "@/components/spinner";


const ProjectOverview = () => {
    const { userId } = useContext(AuthContext);
    const [Project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [task, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [tasksCompleted, setTaskCompleted] = useState(0);
    const navigate = useNavigate();
    const { setProjectId } = useContext(AuthContext);
    const { id } = useParams();
    const URL =
        import.meta.env.VITE_NODE_ENV === 'production'
            ? import.meta.env.VITE_API_BASE_URL_PROD
            : import.meta.env.VITE_API_BASE_URL_DEV;
    const getProject = async () => {
        try {
            const response_project = await fetch(`${URL}/project/getOne?projectId=${id}`, {
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
            const response_members = await fetch(`${URL}/team/getAll?teamId=${teamId}`, {
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
            const response = await fetch(`${URL}/task/taskforUser?id=${id}&UserId=${userId.id}`, {
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
        if (id && userId) {
            setProjectId(id);
            getProject();
            getTask();
        }
    }, [id, userId]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner height={70} width={70}color={'#000000'}/>
            </div>
        );
    }

    if (!Project) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">Project data not found.</p>
            </div>
        );
    }

    const progress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <h1 className="text-2xl lg:text-3xl font-bold">{Project?.name}</h1>
                                </div>
                                <p className="text-gray-600">{Project?.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        <span>Created: {formatDateToDDMMYYYY(Project?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-gray-500" />
                                        <span>Deadline: {formatDateToDDMMYYYY(Project?.deadline)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Progress Overview */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Progress Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <Doughnut data={chartData} options={chartOptions} />
                            </div>
                            <div className="mt-4 text-center">
                                <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
                                <div className="text-sm text-gray-500">Overall Progress</div>
                            </div>
                        </CardContent>
                    </Card> */}
                    {/* In your ProjectOverview component */}
                    <ProgressChart tasksCompleted={tasksCompleted} totalTasks={totalTasks} />
                    {/* Tasks Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span>Progress</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold">{totalTasks}</div>
                                        <div className="text-sm text-gray-500">Total Tasks</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold">{tasksCompleted}</div>
                                        <div className="text-sm text-gray-500">Completed</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    <Card className="lg:row-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">Team Members</CardTitle>
                            <Users className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {members?.Users?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.TeamUser.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Task Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(task).map(([status, tasks]) => (
                                <div key={status} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">{status}</div>
                                    <div className="text-2xl font-bold mt-1">{tasks.length}</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {((tasks.length / totalTasks) * 100).toFixed(0)}% of total
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectOverview;