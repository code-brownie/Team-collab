/* eslint-disable react/prop-types */
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const UserProfileSection = ({
  isCollapsed,
  userAvatar = null,
  userName,
  userEmail,
  onLogout,
}) => {
  // Get the first letter of the user's name for the fallback
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";

  return (
    <div className="mt-auto px-4 py-3 border-t border-gray-200">
      <Popover>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>

        <PopoverContent align="end" className="w-60">
          <div className="flex flex-col items-start space-y-3">
            {/* User Information */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
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
              <div>
                <p className="font-medium text-gray-700">{userName}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center w-full text-red-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserProfileSection;
