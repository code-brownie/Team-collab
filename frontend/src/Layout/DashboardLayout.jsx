import { Outlet } from 'react-router-dom';
import DashboardSideBar from '../components/DashBoardSideBar';

const DashboardLayout = () => {
    return (
        <div className='flex bg-gray-100'>
            <DashboardSideBar />
            <div className='flex-1 p-4'>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
