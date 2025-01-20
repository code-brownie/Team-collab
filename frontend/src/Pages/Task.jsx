import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Task = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;

  const { userId, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const getAllTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${URL}/task/GetTaskById?id=${userId.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTasks(data.Tasks);
        setFilteredTasks(data.Tasks);
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: 'Failed to get Tasks',
        variant: 'default'
      })
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getAllTask();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === selectedStatus));
    }
  }, [selectedStatus, tasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner height={70} width={70} color={'#000000'} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Tasks</h1>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={task.Project}
              assignedUser={{ name: `You ( ${user.name} )` }}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-sm md:text-base">
                {tasks.length === 0
                  ? "No tasks assigned to you"
                  : `No ${selectedStatus !== 'all' ? selectedStatus : ''} tasks found`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;