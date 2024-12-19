import React from 'react'
import { dummyTasks } from '../data/DummyTask'
import TaskCard from '../components/TaskCard'

const Task = () => {
  return (
    <div className="p-6 bg-gray-100 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {dummyTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          project={task.project}
          assignedUser={task.assignedUser}
        />
      ))}
    </div>
  )
}

export default Task