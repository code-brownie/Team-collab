import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { links } from '../data/DashBoardLinks';
import CloseButton from './CloseButton';
import UserProfileSection from './UserProfile';
import { AuthContext } from '../context/AuthContext';

const DashboardSideBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { userId, fetchUserDetails, logout, user } = useContext(AuthContext);

    useEffect(() => {
        if (user) return;
        if (userId && userId.id) {
            fetchUserDetails(userId.id);
        }
    }, [userId]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        console.log("User logged out");
        logout();
    };
    return (
        <div
            className={`${isCollapsed ? 'w-16' : 'w-64'
                } h-screen bg-gray-100 shadow-md flex flex-col transition-all py-4 duration-300`}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                {!isCollapsed && (
                    <div className="flex items-center">
                        <img
                            src='/logo.png'
                            alt="Logo"
                            className="w-6 h-6 mr-2"
                        />
                        <span className="md:text-2xl font-bold sm:text-sm text-gray-800">Team-collab</span>
                    </div>
                )}
                <CloseButton toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
            </div>

            {/* Navigation Section */}
            <nav className="mt-4 flex-grow">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.id}>
                            <Link
                                to={link.path}
                                className="flex items-center px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            >
                                <span className="mr-3">{link.icon}</span>
                                {!isCollapsed && link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            {user ? (<UserProfileSection
                isCollapsed={isCollapsed}
                userEmail={user.email}
                userName={user.name}
                onLogout={handleLogout}
            />) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DashboardSideBar;
