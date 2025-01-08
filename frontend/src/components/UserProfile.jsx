/* eslint-disable react/prop-types */
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const UserProfileSection = ({
    isCollapsed,
    userAvatar = null,
    userName,
    onLogout
}) => {
    const [showLogout, setShowLogout] = useState(false);

    // Get the first letter of the user's name for the fallback
    const userInitial = userName ? userName.charAt(0).toUpperCase() : '';

    return (
        <div className="mt-auto px-4 py-3 border-t border-gray-200"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}>
            <div
                className="relative"
            >
                <div className="flex items-center cursor-pointer">
                    <Avatar className="w-8 h-8">
                        {userAvatar ? (
                            <AvatarImage
                                src={userAvatar}
                                alt={userName}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="bg-gray-900 text-gray-200">
                                {userInitial}
                            </AvatarFallback>
                        )}
                    </Avatar>

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
                        onMouseEnter={() => setShowLogout(true)}
                        onMouseLeave={() => setShowLogout(false)}
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
