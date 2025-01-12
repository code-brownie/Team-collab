import { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthContext } from "@/context/AuthContext";
import SummaryCard from "../components/SummaryCard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/project/getMany/${userId.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userId.id) {
      fetchProjects();
    }
  }, [userId]);

  const taskStats = projects.reduce(
    (acc, project) => {
      project.Tasks.forEach((task) => {
        acc.total += 1;
        if (task.status === "To Do") acc.toDo += 1;
        else if (task.status === "In Progress") acc.inProgress += 1;
        else if (task.status === "Review") acc.review += 1;
        else if (task.status === "Done") acc.done += 1;
      });
      return acc;
    },
    { total: 0, toDo: 0, inProgress: 0, review: 0, done: 0 }
  );

  const doughnutChartData = {
    labels: ["To Do", "In Progress", "Review", "Done"],
    datasets: [
      {
        data: [
          taskStats.toDo,
          taskStats.inProgress,
          taskStats.review,
          taskStats.done,
        ],
        backgroundColor: ["#818cf8", "#a78bfa", "#fbbf24", "#34d399"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineChartData = {
    labels: projects.map((project) => project.name),
    datasets: [
      {
        label: "Tasks Per Project",
        data: projects.map((project) => project.Tasks.length),
        borderColor: "#818cf8",
        backgroundColor: "rgba(129, 140, 248, 0.1)",
        tension: 0.4,
        fill: true,
        pointStyle: "circle",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {!loading ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Total Projects" value={projects.length} />
            <SummaryCard title="Total Tasks" value={taskStats.total} />
            <SummaryCard title="Tasks Completed" value={taskStats.done} />
            <SummaryCard title="Tasks To Do" value={taskStats.toDo} />
          </div>

          {/* Charts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="charts" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="charts">Charts View</TabsTrigger>
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                </TabsList>

                <TabsContent value="charts">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Task Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                          <Doughnut data={doughnutChartData} options={doughnutOptions} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tasks Per Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <Line data={lineChartData} options={lineOptions} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-500 mb-4">{project.description}</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>Team: {project.Team.name}</p>
                            <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                            <p>Tasks: {project.Tasks.length}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;