/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, team }) => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words">{project.name}</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words">
                {project.description || 'No description provided.'}
            </p>
            <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 space-y-2">
                <p className="flex flex-wrap items-center gap-1">
                    <span className="font-bold">Team name:</span>
                    <span className="break-words">{team ? team.name : 'No team assigned'}</span>
                </p>
                <p className="flex flex-wrap items-center gap-1">
                    <span className="font-bold">Deadline:</span>
                    <span>
                        {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : 'No deadline set'}
                    </span>
                </p>
            </div>
            <Link
                to={`/project/${project.id}/overview`}
                className="block w-full text-center bg-gray-900 text-white text-xs sm:text-sm font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
                View Details
            </Link>
        </div>
    );
};

export default ProjectCard;
