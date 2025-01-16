import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/spinner";

const Task = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;

  const { userId, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner height={70} width={70} color={'#000000'} />
      </div>
    );
  }
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Your Tasks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            project={task.Project}
            assignedUser={{ name: `You ( ${user.name} )` }}
          />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-sm md:text-base">No task assigned to you</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;