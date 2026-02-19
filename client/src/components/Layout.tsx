import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role, ROLE_LABELS } from '../types';
import { useEffect, useState } from 'react';
import api from '../services/api';

const NAV_ITEMS: Record<string, { label: string; path: string; roles: Role[] }[]> = {
  main: [
    { label: 'Дашборд', path: '/dashboard', roles: Object.values(Role) },
    { label: 'Розклад', path: '/schedule', roles: Object.values(Role) },
    { label: 'Дисципліни', path: '/courses', roles: [Role.STUDENT, Role.TEACHER, Role.DEPARTMENT_HEAD, Role.DEAN] },
    { label: 'Завдання', path: '/assignments', roles: [Role.STUDENT] },
    { label: 'Оцінки', path: '/grades', roles: [Role.STUDENT] },
    { label: 'Користувачі', path: '/users', roles: [Role.ADMIN, Role.PRESIDENT, Role.RECTOR, Role.DEAN] },
  ],
};

export default function Layout() {
  const { user, logout, loadProfile } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  useEffect(() => {
    api.get('/notifications/unread-count')
      .then(({ data }) => setUnreadCount(data.count))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleNavItems = NAV_ITEMS.main.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-blue-900 text-white transition-all duration-300 flex-shrink-0`}>
        <div className="p-4">
          <h1 className="text-lg font-bold">Кампус МАУП</h1>
          <p className="text-blue-300 text-sm mt-1">
            {user && ROLE_LABELS[user.role]}
          </p>
        </div>
        <nav className="mt-4">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2.5 text-blue-100 hover:bg-blue-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/notifications"
            className="block px-4 py-2.5 text-blue-100 hover:bg-blue-800 transition-colors"
          >
            Сповіщення
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.lastName} {user.firstName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Вийти
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
