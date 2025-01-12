/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import TaskCreationForm from '../forms/TaskCreationForm';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Calendar, Plus } from 'lucide-react';
import DialogWrapper from '@/components/DailogWrapper';

const KanbanBoard = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const [expandedColumn, setExpandedColumn] = useState(null);
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
            toast({
                title: "Error",
                description: "Failed to fetch tasks.",
                variant: "destructive",
            });
            console.log(error);
        }
    };

    useEffect(() => {
        if (id && user) {
            getProject();
            getTask();
        }
    }, [id, user]);

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
            toast({
                title: "Task Updated",
                description: `Task "${task.title}" moved to ${targetStatus}.`,
                variant: "default",
            });
        } catch (error) {
            console.error('Error updating task status:', error);
            toast({
                title: "Error",
                description: "Failed to update task status.",
                variant: "destructive",
            });
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
            toast({
                title: "Task Created",
                description: `Task "${newTask.title}" was successfully created.`,
                variant: "default",
            });
            // Refresh tasks after creation
            getTask();
            setCreateTaskDialogOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create task.",
                variant: "destructive",
            });
            console.error('Error creating task:', error);
        }
    };

    const toggleColumn = (status) => {
        setExpandedColumn(expandedColumn === status ? null : status);
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <div className="p-4 md:p-6 bg-white min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-black">Project Tasks</h1>
                    <button
                        onClick={() => setCreateTaskDialogOpen(true)}
                        className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Task
                    </button>
                </div>

                <DialogWrapper
                    isOpen={isCreateTaskDialogOpen}
                    onOpenChange={setCreateTaskDialogOpen}
                    title="Create Task"
                // description="Enter the team join code to become a member of this team."
                >
                    <TaskCreationForm users={users} onSubmit={handleTaskSubmit} setCreateTaskDialogOpen={setCreateTaskDialogOpen} />
                </DialogWrapper>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {Object.entries(tasks).map(([status, taskList]) => (
                        <div key={status} className="bg-gray-50 rounded-lg p-4">
                            <button
                                onClick={() => toggleColumn(status)}
                                className="w-full flex justify-between items-center text-left"
                            >
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold text-black capitalize">
                                        {status}
                                    </h2>
                                    <span className="text-sm text-gray-500">({taskList.length})</span>
                                </div>
                                {expandedColumn === status ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {expandedColumn === status && (
                                <div className="mt-4 space-y-3">
                                    {taskList.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            users={users}
                                            priorityConfig={priorityConfig}
                                            isDeadlineNear={isDeadlineNear}
                                            formatDate={formatDate}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        users={users}
                                        priorityConfig={priorityConfig}
                                        isDeadlineNear={isDeadlineNear}
                                        formatDate={formatDate}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task, status)}
                                        isDragging={isDragging}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// Extracted TaskCard component for reusability
const TaskCard = ({ task, users, priorityConfig, isDeadlineNear, formatDate, draggable, onDragStart, isDragging }) => (
    <div
        draggable={draggable}
        onDragStart={onDragStart}
        className={`p-3 md:p-4 bg-white rounded-lg shadow-sm border border-gray-200 
            ${draggable ? 'cursor-move hover:shadow-md' : ''} 
            transition-shadow ${isDragging ? 'opacity-60' : ''}`}
    >
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
            <h3 className="font-medium text-black flex-grow text-sm md:text-base">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit 
                ${priorityConfig[task.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                {task.priority || 'No Priority'}
            </span>
        </div>
        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm">
            <div className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    👤
                </span>
                <span className="text-gray-600 truncate max-w-[120px]">
                    {users.find(u => u.id === task.assignedUserId)?.name || 'Unassigned'}
                </span>
            </div>
            <div className={`flex items-center gap-1 ${isDeadlineNear(task.deadline) ? 'text-red-600' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.deadline)}</span>
            </div>
        </div>
    </div>
);

export default KanbanBoard;