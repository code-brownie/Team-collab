import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { links } from '../data/ProjectLinks';
import CloseButton from './CloseButton';
import { AuthContext } from '../context/AuthContext';
import logo from "../assets/logo.png";
import UserProfileSection from './UserProfile';
const ProjectSideBar = () => {
    const { userId, fetchUserDetails, logout, user, projectId } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
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
                            src={logo}
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
                                to={link.path.replace(':id', projectId)}
                                className="flex items-center px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition"
                            >
                                <span className="mr-3">{link.icon}</span>
                                {!isCollapsed && link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {user ? (<UserProfileSection
                isCollapsed={isCollapsed}
                userAvatar="src/assets/user-avatar.png" // Update with actual avatar URL
                userName={user.name}
                onLogout={handleLogout}
            />) : (
                <p>Loading...</p>
            )}

        </div>
    );
}

export default ProjectSideBar