import { NotificationContext } from '@/context/NotificationContext';
import { useContext } from 'react';


const NotificationBell = () => {
    const { unreadCount } = useContext(NotificationContext);

    return (
        <div className="relative inline-block">
            <svg className="h-5 w-5 text-gray-600" /* Bell Icon SVG */ />
            {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </div>
    );
};
export default NotificationBell;
