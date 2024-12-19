/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const TaskCard = ({ task, project, assignedUser }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do':
                return 'bg-gray-300';
            case 'In Progress':
                return 'bg-yellow-500';
            case 'Done':
                return 'bg-green-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getProgress = (status) => {
        switch (status) {
            case 'To Do':
                return 0;
            case 'In Progress':
                return 50;
            case 'Done':
                return 100;
            default:
                return 0;
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                <span
                    className={`text-sm px-3 py-1 rounded-lg 
                        ${task.priority === 'High'
                            ? 'bg-red-100 text-red-500'
                            : task.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-500'
                                : 'bg-green-100 text-green-500'
                        }`}
                >
                    {task.priority}
                </span>
            </div>
            <p className="text-base text-gray-600 mb-4">{task.description}</p>
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="font-medium">Status: {task.status}</span>
                    <span className="font-medium">{getProgress(task.status)}%</span>
                </div>
                <div className="h-3 rounded-md bg-gray-200">
                    <div className={`h-full rounded-md ${getStatusColor(task.status)}`}
                        style={{ width: `${getProgress(task.status)}%` }}
                    ></div>
                </div>
            </div>
            <div className="text-sm text-gray-600">
                <p>
                    <span className="font-bold">Project:</span>{' '}
                    {project ? project.name : 'N/A'}
                </p>
                <p>
                    <span className="font-bold">Assigned to:</span>{' '}
                    {assignedUser ? assignedUser.name : 'N/A'}
                </p>
                <p>
                    <span className="font-bold">Deadline:</span>{' '}
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default TaskCard;
