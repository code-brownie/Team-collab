import { useState } from 'react';
import { Link } from 'react-router-dom';
import { links } from '../data/sideLinks';
import CloseButton from './CloseButton';


const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
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
                            src="src/assets/logo.png"
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
        </div>
    );
};

export default Sidebar;
