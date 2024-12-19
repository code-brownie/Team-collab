import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const MainLayout = () => {
    return (
        <div className='flex bg-gray-100'>
            <Sidebar />
            <div className='flex-1 p-4'>
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
