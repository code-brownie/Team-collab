import { Outlet } from 'react-router-dom';
import ProjectSideBar from '../components/ProjectSideBar';

const ProjectLayout = () => {
    return (
        <div className='flex bg-gray-100'>
            <ProjectSideBar />
            <div className='flex-1 p-4'>
                <Outlet />
            </div>
        </div>
    );
};

export default ProjectLayout;