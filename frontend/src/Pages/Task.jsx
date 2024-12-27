import TaskCreationForm from '../forms/TaskCreationForm'

const Task = () => {
  return (
    <div className="p-6 bg-gray-100 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <TaskCreationForm />
    </div>
  )
}

export default Task