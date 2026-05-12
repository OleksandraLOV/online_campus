import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';

export default function NotificationsBell() {
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await api.get(
          '/notifications/unread-count',
        );

        setCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <button
      onClick={() =>
        navigate('/notifications')
      }
      className="
        relative
        flex
        items-center
        justify-center
        w-10
        h-10
        rounded-full
        border
        border-gray-300
        bg-white
        hover:bg-gray-100
        transition-colors
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-5 h-5 text-gray-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0m5.714 0H18a2 2 0 0 0 2-2v-1.586a1 1 0 0 0-.293-.707l-1.414-1.414A2 2 0 0 1 18 9.586V9a6 6 0 1 0-12 0v.586a2 2 0 0 1-.293 1.707L4.293 12.707A1 1 0 0 0 4 13.414V15a2 2 0 0 0 2 2h2.857"
        />
      </svg>

      {count > 0 && (
        <span
          className="
            absolute
            -top-1
            -right-1
            min-w-[18px]
            h-[18px]
            px-1
            rounded-full
            bg-red-500
            text-white
            text-[11px]
            flex
            items-center
            justify-center
            font-medium
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}