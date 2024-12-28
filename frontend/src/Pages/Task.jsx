import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";


const Task = () => {
  const { userId, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const getAllTask = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/task/GetTaskById?id=${userId.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

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
    <div className="p-6 bg-gray-100 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          project={task.Project}
          assignedUser={{ name: `You ( ${user.name} )` }}
        />
      ))}
    </div>
  );
};

export default Task;
