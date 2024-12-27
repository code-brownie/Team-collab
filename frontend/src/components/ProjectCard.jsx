/* eslint-disable react/prop-types */
import { Link} from 'react-router-dom';
    
const ProjectCard = ({ project, team }) => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
            </div>
            <p className="text-base text-gray-600 mb-4">{project.description || 'No description provided.'}</p>
            <div className="text-sm text-gray-600 mb-4">
                <p>
                    <span className="font-bold">Team name:</span>{' '}
                    {team ? team.name : 'No team assigned'}
                </p>
                <p>
                    <span className="font-bold">Deadline:</span>{' '}
                    {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : 'No deadline set'}
                </p>
            </div>
            <Link
                to={`/project/${project.id}/overview`}
                className="block text-center bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-600"
            >
                View Details
            </Link>
        </div>
    );
};

export default ProjectCard;
