import { useContext, useEffect, useState } from 'react';
import TaskModal from '../components/TaskModal';
import TaskCreationForm from '../forms/TaskCreationForm';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const KanbanBoard = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const [tasks, setTasks] = useState({
        'To Do': [],
        'In Progress': [],
        'Review': [],
        'Done': []
    });

    // Fetch the project with the team users
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
            setUsers(data_project.project.Team.Users);
        } catch (error) {
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
                        groupedTasks['To Do'].push(task); // Default status if unknown
                    }
                });

                setTasks(groupedTasks);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id && user) {
            getProject();
            getTask();
        }
    }, [id, user]);

    const [isModalOpen, setModalOpen] = useState(false);
    const priorityConfig = {
        High: { color: 'bg-red-100 text-red-800', label: 'High' },
        Medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
        Low: { color: 'bg-green-100 text-green-800', label: 'Low' }
    };

    const [isDragging, setIsDragging] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);

    const handleDragStart = (e, task, status) => {
        setDraggedTask({ task, sourceStatus: status });
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggedTask) return;

        const { task, sourceStatus } = draggedTask;
        if (sourceStatus === targetStatus) return;

        // Update UI optimistically
        setTasks(prev => ({
            ...prev,
            [sourceStatus]: prev[sourceStatus].filter(t => t.id !== task.id),
            [targetStatus]: [...prev[targetStatus], { ...task, status: targetStatus }]
        }));

        // TODO: Add API call to update task status in backend
        try {
            const response = await fetch('http://localhost:3000/api/task/updateTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: targetStatus,
                    id: task.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert UI state if API call fails
            getTask();
        }

        setIsDragging(false);
        setDraggedTask(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const isDeadlineNear = (deadline) => {
        if (!deadline) return false;
        const today = new Date();
        const dueDate = new Date(deadline);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2 && diffDays >= 0;
    };

    const handleTaskSubmit = async (newTask) => {
        try {
            const response = await fetch('http://localhost:3000/api/task/createTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newTask,
                    projectId: id,
                    status: 'To Do'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            // Refresh tasks after creation
            getTask();
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-black">Project Tasks</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                </button>
            </div>
            <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <TaskCreationForm users={users} onSubmit={handleTaskSubmit} setModalOpen={setModalOpen} />
            </TaskModal>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(tasks).map(([status, taskList]) => (
                    <div
                        key={status}
                        className="bg-gray-50 rounded-lg p-4"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <h2 className="text-lg font-semibold mb-4 text-black capitalize">
                            {status}
                            <span className="ml-2 text-sm text-gray-500">({taskList.length})</span>
                        </h2>

                        <div className="space-y-3">
                            {taskList.map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task, status)}
                                    className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 
                                        cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-black">{task.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {task.priority || 'No Priority'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                👤
                                            </span>
                                            <span className="text-gray-600">
                                                {users.find(u => u.id === task.assignedUserId)?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${isDeadlineNear(task.deadline) ? 'text-red-600' : 'text-gray-600'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(task.deadline)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;