import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../../services/api';

export default function NotificationsBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = () => {
      api
        .get('/notifications/unread-count')
        .then((res) => {
          if (isMounted) {
            setUnreadCount(res.data.count ?? 0);
          }
        })
        .catch(() => {
          if (isMounted) {
            setUnreadCount(0);
          }
        });
    };

    loadUnreadCount();

    const intervalId = window.setInterval(loadUnreadCount, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Link
      to="/notifications"
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-gray-50 hover:border-gray-400">
      <Bell className="h-5 w-5 text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
