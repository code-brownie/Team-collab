import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

const Task = () => {
  const URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;

  const { userId, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const getAllTask = async () => {
    try {
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getAllTask();
    }
  }, [userId]);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            project={task.Project}
            assignedUser={{ name: `You ( ${user.name} )` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Task;