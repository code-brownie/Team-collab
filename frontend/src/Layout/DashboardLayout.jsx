import { Outlet } from 'react-router-dom';
import DashboardSideBar from '../components/DashBoardSideBar';
import { useEffect, useState } from 'react';

const DashboardLayout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [showSidebar, setShowSidebar] = useState(!isMobile);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setShowSidebar(!showSidebar);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Overlay */}
            {isMobile && showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed lg:relative
                h-full z-50
                transition-transform duration-300 ease-in-out
                ${showSidebar ? 'translate-x-0' : 'translate-x-0 w-16'}
                border-r border-gray-200 shadow-sm
            `}>
                <DashboardSideBar
                    isCollapsed={!showSidebar}
                    toggleSidebar={toggleSidebar}
                />
            </aside>

            {/* Main Content with Padding */}
            <main className={`
                flex-1 h-screen overflow-auto
                transition-all duration-300 ease-in-out
                md:p-3 lg:p-4
                bg-gray-50
                ${isMobile ? 'ml-16' : ''}
            `}>
                <div className="h-full bg-white">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
