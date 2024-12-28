/* eslint-disable react/prop-types */
import { useState } from 'react';
import { LogOut, User } from 'lucide-react';

const UserProfileSection = ({
    isCollapsed,
    userAvatar,
    userName,
    onLogout
}) => {
    const [showLogout, setShowLogout] = useState(false);

    return (
        <div className="mt-auto px-4 py-3 border-t border-gray-200"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}>
            <div
                className="relative"
            >
                <div className="flex items-center cursor-pointer">
                    {userAvatar ? (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500" />
                        </div>
                    )}

                    {!isCollapsed && (
                        <span className="ml-3 font-medium text-gray-700 truncate">
                            {userName}
                        </span>
                    )}
                </div>

                {/* Logout Popup */}
                {showLogout && (
                    <div
                        className={`absolute ${isCollapsed ? 'left-full ml-2' : 'bottom-full mb-2'} bg-white shadow-lg rounded-lg py-2 px-4 min-w-[120px]`}
                        onMouseEnter={() => setShowLogout(true)} // Prevent popup from disappearing
                        onMouseLeave={() => setShowLogout(false)} // Hide popup when mouse leaves
                    >
                        <button
                            onClick={onLogout}
                            className="flex items-center w-full text-red-600 hover:bg-gray-50 px-2 py-1 rounded"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileSection;
